import projectService from "../services/project.service.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const createProject = asyncHandler(async(req,res)=>{
    const userId = req.user?.Id;
    const {name,description} = req.body;

    const project = await projectService.createProject({
        name,
        description,
        owner:userId
    })

    return res.status(201).json(
        new ApiResponse(201,{project},"Project created successfully")
    )
})

export const getUserProjects = asyncHandler(async(req,res)=>{
    const userId = req.user?.Id;

    const projects = await projectService.getUserProjects({userId});


    return res.status(200).json(
        new ApiResponse(200, { projects }, "Projects fetched successfully")
    )
})

export const getProject = asyncHandler(async(req,res)=>{
    const {projectId} = req.params;
    const userId = req.user?.Id;

    const project = await projectService.getCurrentProject({projectId,userId})

    return res.status(200).json(
        new ApiResponse(200,{project},"Project fetched successfully")
    )   
})
