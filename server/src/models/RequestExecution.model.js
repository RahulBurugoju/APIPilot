import mongoose from "mongoose";

const requestSnapshotSchema = new mongoose.Schema(
    {
        method: {
            type: String,
            required: true,
            enum: [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "HEAD",
                "OPTIONS",
            ],
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        headers: {
            type: [
                {
                    key: {
                        type: String,
                        trim: true,
                    },

                    value: {
                        type: String,
                        default: "",
                    },

                    enabled: {
                        type: Boolean,
                        default: true,
                    },
                },
            ],
            default: [],
        },

        queryParams: {
            type: [
                {
                    key: {
                        type: String,
                        trim: true,
                    },

                    value: {
                        type: String,
                        default: "",
                    },

                    enabled: {
                        type: Boolean,
                        default: true,
                    },
                },
            ],
            default: [],
        },

        body: {
            type: {
                type: String,
                enum: [
                    "none",
                    "json",
                    "text",
                    "form-data",
                    "urlencoded",
                ],
                default: "none",
            },

            content: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },
        },

        auth: {
            type: {
                type: String,
                enum: [
                    "none",
                    "bearer",
                    "basic",
                    "api-key",
                ],
                default: "none",
            },

            bearer: {
                token: {
                    type: String,
                    default: "",
                },
            },

            basic: {
                username: {
                    type: String,
                    default: "",
                },

                password: {
                    type: String,
                    default: "",
                },
            },

            apiKey: {
                key: {
                    type: String,
                    default: "",
                },

                value: {
                    type: String,
                    default: "",
                },

                location: {
                    type: String,
                    enum: ["header", "query"],
                    default: "header",
                },
            },
        },
    },
    {
        _id: false,
    }
);

const responseSchema = new mongoose.Schema(
    {
        status: {
            type: Number,
            default: null,
        },

        statusText: {
            type: String,
            default: "",
        },

        headers: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        data: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },

        duration: {
            type: Number,
            default: 0,
        },

        size: {
            type: Number,
            default: 0,
        },

        contentType: {
            type: String,
            default: "text/plain",
        },
    },
    {
        _id: false,
    }
);

const requestExecutionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },

        collection: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
            required: true,
            index: true,
        },

        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request",
            required: true,
            index: true,
        },

        environment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Environment",
            default: null,
        },

        requestSnapshot: {
            type: requestSnapshotSchema,
            required: true,
        },

        response: {
            type: responseSchema,
            default: null,
        },

        success: {
            type: Boolean,
            default: false,
        },

        error: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const RequestExecution = mongoose.model(
    "RequestExecution",
    requestExecutionSchema
);

export default RequestExecution;