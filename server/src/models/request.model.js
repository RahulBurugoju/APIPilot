import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
            "PATCH",
            "HEAD",
            "OPTIONS"
        ],
        default: "GET"
    },
    url: {
        type: String,
        trim: true,
        default: "",
        maxlength: 2000
    },
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection",
        required: true,
        index: true
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
      enum: [
        "header",
        "query",
      ],
      default: "header",
    },
  },
},
    order: {
        type: Number,
        default: 0,
    },

}, { timestamps: true })

const Request = mongoose.model("Request", requestSchema);

export default Request;