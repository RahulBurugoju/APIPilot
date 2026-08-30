import Environment from "../models/environment.model.js";
import { ApiError } from "../utils/ApiError.js";


const createEnvironment = async ({projectId,name,variables,isActive}) => {
    const environment = await Environment.create({
        name,
        project:projectId,
        variables,
        isActive
    })

    if(!environment){
        throw new ApiError(500,"Failed to create environment")
    }

    return environment;

}
const getProjectEnvironments = async ({projectId}) => {
    const environments = await Environment.find({
        project:projectId
    })

    if(!environments){
        throw new ApiError(500,"Failed to get environments")
    }

    return environments;

}
const getEnvironmentById = async ({environmentId,projectId}) => {
    const environment = await Environment.findOne({
        _id:environmentId,
        project:projectId
    })

    if(!environment){
        throw new ApiError(500,"Failed to get environment")
    }

    return environment;

}
const updateEnvironment = async ({environmentId,projectId,name,variables,isActive}) => {
   
    const updateFileds ={}
    if(name){
        updateFileds.name = name
    }
    if(variables){
        updateFileds.variables = variables
    }
    if(isActive){
        updateFileds.isActive = isActive
    }

    const updatedEnvironment = await Environment.findOneAndUpdate(
        { _id:environmentId, project:projectId },
        {
            $set:updateFileds
        },{
            new:true,
            runValidators:true
        }
    )

    if(!updatedEnvironment){
        throw new ApiError(500,"Failed to update environment")
    }
    return updatedEnvironment;

}
const deleteEnvironment = async ({environmentId,projectId}) => {

    const environment = await Environment.findOneAndDelete(
        { _id:environmentId, project:projectId   },
        {
            new:true,
            runValidators:true
        }
    )
    if(!environment){
        throw new ApiError(404,"Environment not found")
    }
    return environment;

}
const setActiveEnvironment = async ({environmentId,projectId}) => {

    const environment = await Environment.findOneAndUpdate(
        { _id:environmentId, project:projectId },
        {
            $set:{
                isActive:true
            }
        },{
            new:true,
            runValidators:true
        }
    )
    if(!environment){
        throw new ApiError(404,"Environment not found")
    }
    return environment;

}

export default {
    createEnvironment,
    getProjectEnvironments,
    getEnvironmentById,
    updateEnvironment,
    deleteEnvironment,
    setActiveEnvironment    
}