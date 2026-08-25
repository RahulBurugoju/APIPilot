import Project from "../models/project.model.js";

const createProject = async({name,description,owner})=>{
    const project = await Project.create({
        name,
        description,
        owner
    })

    return project
}

const updateProject = async ({projectId,updatePayload}) => {
    const project = await Project.findByIdAndUpdate(
        projectId,
        updatePayload,
        { new: true, runValidators: true },
    )
    return project
}


const deleteProject = async ({projectId}) => {
    const project = await Project.findByIdAndDelete(projectId)
    return project
}

const getCurrentProject = async({projectId}) => {
    const project = await Project.findById(projectId)
    return project
}

export default {
    createProject,
    updateProject,
    deleteProject,
    getCurrentProject
}