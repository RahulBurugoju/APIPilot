import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    name: {
        type: String,
        requires: true,
        trim: true,
        maxlength: 150,
    },
    method: {
        type: String,
        enum: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH"
        ],
        default: "GET"
    },
    url: {
        type: String,
        trim: true,
        default: " ",
        maxlength: 2000
    },
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection",
        required: true,
        index: true
    },
    header: {
        type: [
            {
                key: {
                    type: String,
                    trim: true,
                },
                value: {
                    type: String,
                    trim: true,
                },
                enabled: {
                    type: Boolean,
                    default: true,
                }
            }
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
                    trim: true,
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
            type: String,
            default: "",
        },
    },
    order: {
        type: Number,
        default: 0,
    },

}, { timestamps: true })

const Request = mongoose.model("Request", requestSchema);

export default Request;