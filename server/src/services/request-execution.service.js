import axios from "axios";

import Request from "../models/request.model.js";
import Collection from "../models/collection.model.js";
import Project from "../models/project.model.js";

import { ApiError } from "../utils/ApiError.js";
import buildRequestUrl from "../utils/buildRequestUrl.js";

const getRequestContext = async ({ projectId, collectionId, requestId }) => {
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

    return { project, collection, request };
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

        try {
            return JSON.parse(body.content);
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
        return body.content;
    }

    if (
        body.type === "urlencoded"
    ) {
        return body.content;
    }

    return undefined;
};

const executeRequest = async ({
    projectId,
    collectionId,
    requestId,
}) => {
    const { project, collection, request } = await getRequestContext({
        projectId,
        collectionId,
        requestId
    });

    const effectiveBaseUrl = collection.baseUrl || project.baseUrl;
    const url = buildRequestUrl({
        baseUrl: effectiveBaseUrl,
        reqUrl: request.url
    });

    const queryParams = buildQueryParams(request.queryParams);
    const headers = buildHeaders(request.headers);

    const authentication = applyAuthentication({
        auth: request.auth,
        headers,
        queryParams
    });

    const body = buildRequestBody({
        body: request.body,
        method: request.method
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

    try {
        response = await axios(config);
    } catch (err) {
        const duration = Date.now() - startTime;

        // Handle request timeout (ECONNABORTED)
        if (err.code === "ECONNABORTED" || err.message?.toLowerCase().includes("timeout")) {
            return {
                status: 408,
                statusText: "Request Timeout",
                headers: {},
                data: {
                    error: "Request Timeout",
                    message: `Request timed out after ${config.timeout}ms`,
                    code: "ECONNABORTED",
                },
                duration,
                request: {
                    method: request.method,
                    url,
                    queryParams,
                    headers,
                    hasAuth: !!(authentication.axiosAuth || request.auth?.type !== "none"),
                },
                size: 0,
            };
        }

        // Target unreachable or DNS resolution failure
        throw new ApiError(
            502,
            `Could not connect to target host: ${err.message || "Network Error"}`
        );
    }

    const duration = Date.now() - startTime;

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

    const size = getResponseSize(
        response.headers,
        response.data
    );

    return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        duration,
        request: {
            method: request.method,
            url,
            queryParams,
            headers,
            hasAuth:
                !!(authentication.axiosAuth ||
                    request.auth?.type !== "none"),
        },
        size
    };
};

export {
    executeRequest
};