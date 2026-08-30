import environmentService from "../services/environment.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createEnvironment = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { name, variables, isActive } = req.body;
    const environment = await environmentService.createEnvironment({
        projectId,
        name,
        variables,
        isActive
    });
    return res.status(201)
    .json(new ApiResponse(200, {environment},"Environment created successfully"));
})

const getProjectEnvironments = asyncHandler(async(req,res)=>{
    const {projectId} = req.params;
    const environments = await environmentService.getProjectEnvironments({projectId});
    return res.status(200)
    .json(new ApiResponse(200, {environments},"Environments fetched successfully"));
})

const getEnvironmentById = asyncHandler(async(req,res)=>{
    const {projectId, environmentId} = req.params;
    const environment = await environmentService.getEnvironmentById({projectId,environmentId});
    return res.status(200)
    .json(new ApiResponse(200, {environment},"Environment fetched successfully"));
})

const updateEnvironment = asyncHandler(async(req,res)=>{
    const {projectId, environmentId} = req.params;
    const { name, variables, isActive } = req.body;

    const envirnoment = await environmentService.updateEnvironment({projectId,environmentId,name,variables,isActive})
    return res.status(200)
    .json(new ApiResponse(200,{envirnoment},"Environment updated successfully"));
})

const deleteEnvironment = asyncHandler(async(req,res)=>{
    const {projectId, environmentId} = req.params;
    const environment = await environmentService.deleteEnvironment({projectId,environmentId});
    return res.status(200)
    .json(new ApiResponse(200, {environment},"Environment deleted successfully"));
})

const setActiveEnvironment = asyncHandler(async(req,res)=>{
    const {projectId, environmentId} = req.params;
    const environment = await environmentService.setActiveEnvironment({projectId,environmentId});
    return res.status(200)
    .json(new ApiResponse(200, {environment},"Environment activated successfully"));
})

export default {
    createEnvironment,
    getProjectEnvironments,
    getEnvironmentById,
    updateEnvironment,
    deleteEnvironment,
    setActiveEnvironment
}
