import mongoose from "mongoose"

const envronmentVariableSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
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
    secret: {
        type: Boolean,
        default: false,
    },
}, {
    _id: false,
})


const environmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    project: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        index: true,
    },
    variables: {

        type: [envronmentVariableSchema],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

const Environment = mongoose.model("Environment", environmentSchema)
export default Environment