import axios from "axios";

import Request from "../models/request.model.js";
import Collection from "../models/collection.model.js";
import Project from "../models/project.model.js";
import Environment from "../models/environment.model.js";

import { ApiError } from "../utils/ApiError.js";
import buildRequestUrl from "../utils/buildRequestUrl.js";
import resolveVariables from "../utils/resolveVariables.js";
import { createExecution } from "./request-execution-history.service.js";

const getRequestContext = async ({ projectId, collectionId, requestId, environmentId }) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }
    if (collection.project.toString() !== projectId.toString()) {
        throw new ApiError(403, "Collection is not a part of project");
    }

    const request = await Request.findOne({ _id: requestId, collection: collectionId });
    if (!request) {
        throw new ApiError(404, "Request not found");
    }

    // Retrieve active environment for the project (or explicitly requested environmentId)
    let activeEnvironment = null;
    if (environmentId) {
        activeEnvironment = await Environment.findOne({
            _id: environmentId,
            project: projectId,
        });
    } else {
        activeEnvironment = await Environment.findOne({
            project: projectId,
            isActive: true,
        });
    }

    return { project, collection, request, activeEnvironment };
};

const buildQueryParams = (queryParams = []) => {
    return queryParams.reduce((params, item) => {
        if (item.enabled && item.key) {
            params[item.key] = item.value;
        }
        return params;
    }, {});
};

const buildHeaders = (headers = []) => {
    return headers.reduce((acc, header) => {
        if (header.enabled && header.key) {
            acc[header.key] = header.value;
        }
        return acc;
    }, {});
};

const applyAuthentication = ({
    auth,
    headers,
    queryParams
}) => {
    const finalHeaders = { ...headers };
    const finalQueryParams = { ...queryParams };

    if (!auth || auth.type === "none") {
        return {
            headers: finalHeaders,
            queryParams: finalQueryParams,
            axiosAuth: undefined
        };
    }

    if (auth.type === "basic") {
        return {
            headers: finalHeaders,
            queryParams: finalQueryParams,
            axiosAuth: {
                username: auth.basic?.username || "",
                password: auth.basic?.password || ""
            }
        };
    }

    if (auth.type === "bearer") {
        const token = auth.bearer?.token || "";
        if (token) {
            finalHeaders["Authorization"] = `Bearer ${token}`;
        }
        return {
            headers: finalHeaders,
            queryParams: finalQueryParams,
            axiosAuth: undefined
        };
    }

    if (auth.type === "apiKey" || auth.type === "api-key") {
        const key = auth.apiKey?.key || "";
        const value = auth.apiKey?.value || "";
        const location = auth.apiKey?.location || "header";

        if (key && value) {
            if (location === "header") {
                finalHeaders[key] = value;
            } else if (location === "query") {
                finalQueryParams[key] = value;
            }
        }

        return {
            headers: finalHeaders,
            queryParams: finalQueryParams,
            axiosAuth: undefined
        };
    }

    return {
        headers: finalHeaders,
        queryParams: finalQueryParams,
        axiosAuth: undefined
    };
};

const buildRequestBody = ({
    body,
    method,
    variables = [],
}) => {
    if (
        !body ||
        body.type === "none"
    ) {
        return undefined;
    }

    if (
        body.type === "form-data"
    ) {
        throw new ApiError(
            400,
            "Form-data execution is not supported yet"
        );
    }

    if (
        body.type === "json"
    ) {
        if (!body.content) {
            return undefined;
        }

        // Resolve variables inside JSON string before parsing
        const resolvedContent = resolveVariables(body.content, variables);

        try {
            return JSON.parse(resolvedContent);
        } catch {
            throw new ApiError(
                400,
                "Invalid JSON request body"
            );
        }
    }

    if (
        body.type === "text"
    ) {
        return resolveVariables(body.content || "", variables);
    }

    if (
        body.type === "urlencoded"
    ) {
        return resolveVariables(body.content || "", variables);
    }

    return undefined;
};

const executeRequest = async ({
    projectId,
    collectionId,
    requestId,
    environmentId,
    userId,
}) => {
    const { project, collection, request, activeEnvironment } = await getRequestContext({
        projectId,
        collectionId,
        requestId,
        environmentId,
    });

    const variables = activeEnvironment?.variables || [];

    // 1. Resolve URL (both base URL and relative endpoint)
    const effectiveBaseUrl = collection.baseUrl || project.baseUrl || "";
    const resolvedBaseUrl = resolveVariables(effectiveBaseUrl, variables);
    const resolvedReqUrl = resolveVariables(request.url || "", variables);

    const url = buildRequestUrl({
        baseUrl: resolvedBaseUrl,
        reqUrl: resolvedReqUrl,
    });

    // 2. Resolve Query Params
    const rawQueryParams = buildQueryParams(request.queryParams);
    const resolvedQueryParams = resolveVariables(rawQueryParams, variables);

    // 3. Resolve Headers
    const rawHeaders = buildHeaders(request.headers);
    const resolvedHeaders = resolveVariables(rawHeaders, variables);

    // 4. Resolve Auth
    const rawAuth = request.auth
        ? (request.auth.toObject ? request.auth.toObject() : request.auth)
        : null;
    const resolvedAuth = resolveVariables(rawAuth, variables);

    const authentication = applyAuthentication({
        auth: resolvedAuth,
        headers: resolvedHeaders,
        queryParams: resolvedQueryParams,
    });

    const queryParams = authentication.queryParams;
    const headers = authentication.headers;

    // 5. Resolve Body
    const body = buildRequestBody({
        body: request.body,
        method: request.method,
        variables,
    });

    const config = {
        method: request.method,
        url,

        params: authentication.queryParams,

        headers: authentication.headers,

        data: body,

        timeout:
            project.settings?.defaultTimeout ||
            30000,
        validateStatus: () => true,
    };

    if (authentication.axiosAuth) {
        config.auth = authentication.axiosAuth;
    }

    const startTime = Date.now();
    let response;

    const getResponseSize = (
        resHeaders,
        resData
    ) => {
        const contentLength = resHeaders?.["content-length"];

        if (contentLength) {
            return Number(contentLength);
        }

        if (!resData) {
            return 0;
        }

        return Buffer.byteLength(
            typeof resData === "string"
                ? resData
                : JSON.stringify(resData)
        );
    };

    let normalizedResponse;

    try {
        response = await axios(config);
        const duration = Date.now() - startTime;
        const size = getResponseSize(
            response.headers,
            response.data
        );

        normalizedResponse = {
            status: response.status,
            statusText: response.statusText || "OK",
            headers: response.headers || {},
            data: response.data !== undefined ? response.data : null,
            duration,
            size,
        };
    } catch (err) {
        const duration = Date.now() - startTime;

        // Handle request timeout (ECONNABORTED)
        if (
            err.code === "ECONNABORTED" ||
            err.message?.toLowerCase().includes("timeout")
        ) {
            normalizedResponse = {
                status: 408,
                statusText: "Request Timeout",
                headers: {},
                data: {
                    error: "Request Timeout",
                    message: `Request timed out after ${config.timeout}ms`,
                    code: "ECONNABORTED",
                },
                duration,
                size: 0,
            };
        } else {
            // Target unreachable, connection refused, or DNS resolution failure
            normalizedResponse = {
                status: 0,
                statusText: err.code || "Network Error",
                headers: {},
                data: {
                    error: "Could not connect to target host",
                    message:
                        err.message ||
                        "Connection refused or target host unreachable",
                    code: err.code || "ECONNREFUSED",
                },
                duration,
                size: 0,
            };
        }
    }

    // 6. Build Request Snapshot
    const requestSnapshot = {
        method: request.method,
        url,
        headers: (request.headers || []).map((h) => ({
            key: h.key || "",
            value: h.value || "",
            enabled: h.enabled !== false,
        })),
        queryParams: (request.queryParams || []).map((q) => ({
            key: q.key || "",
            value: q.value || "",
            enabled: q.enabled !== false,
        })),
        body: {
            type: request.body?.type || "none",
            content: request.body?.content || null,
        },
        auth: {
            type: request.auth?.type || "none",
            bearer: request.auth?.bearer
                ? {
                      token: request.auth.bearer.token || "",
                  }
                : undefined,
            basic: request.auth?.basic
                ? {
                      username: request.auth.basic.username || "",
                      password: request.auth.basic.password || "",
                  }
                : undefined,
            apiKey: request.auth?.apiKey
                ? {
                      key: request.auth.apiKey.key || "",
                      value: request.auth.apiKey.value || "",
                      location: request.auth.apiKey.location || "header",
                  }
                : undefined,
        },
    };

    // 7. Automatically Save Execution History
    let savedExecution = null;
    const resolvedUserId = userId || project.owner;

    if (resolvedUserId) {
        const isSuccess =
            normalizedResponse.status >= 200 &&
            normalizedResponse.status < 400;

        const executionError =
            !isSuccess &&
            (normalizedResponse.status === 0 ||
                normalizedResponse.status >= 400)
                ? normalizedResponse.data?.message ||
                  normalizedResponse.statusText ||
                  "Execution Error"
                : null;

        try {
            savedExecution = await createExecution({
                userId: resolvedUserId,
                projectId,
                collectionId,
                requestId,
                environmentId: activeEnvironment?._id || null,
                requestSnapshot,
                response: {
                    status: normalizedResponse.status,
                    statusText: normalizedResponse.statusText,
                    headers: normalizedResponse.headers,
                    data: normalizedResponse.data,
                    duration: normalizedResponse.duration,
                    size: normalizedResponse.size,
                },
                success: isSuccess,
                error: executionError,
            });
        } catch (saveErr) {
            console.error(
                "Failed to automatically save request execution history:",
                saveErr
            );
        }
    }

    // 8. Return Response
    return {
        status: normalizedResponse.status,
        statusText: normalizedResponse.statusText,
        headers: normalizedResponse.headers,
        data: normalizedResponse.data,
        duration: normalizedResponse.duration,
        size: normalizedResponse.size,
        executionId: savedExecution?._id || null,
        request: {
            method: request.method,
            url,
            queryParams,
            headers,
            hasAuth:
                !!(authentication.axiosAuth ||
                    request.auth?.type !== "none"),
        },
    };
};

export {
    executeRequest
};

// export default {
//     executeRequest
// };