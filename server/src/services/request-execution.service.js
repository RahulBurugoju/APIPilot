import axios from "axios";

import Request from "../models/request.model.js";
import Collection from "../models/collection.model.js";
import Project from "../models/project.model.js";

import { ApiError } from "../utils/ApiError.js";

import buildRequestUrl from "../utils/buildRequestUrl.js";

const getRequestContext = async({ProjectId,collectionId,requestId})=>{
    
    const project = await Project.findById({_id:ProjectId})

    if(!project){
        throw new ApiError(404,"Project not found")
    }

   
    if(collectionId !== null){
        const collection = await Collection.findById({_id:collectionId})
        if(!collection){
            throw new ApiError(404,"Collection not found")
        }
        if(collection.project.toString() !== ProjectId){
            throw new ApiError(403,"Collection is not a part of project")
        }
    }

    const request = await Request.findOne({_id:requestId,collection:collectionId})
    if(!request){
        throw new ApiError(404,"Request not found")
    }
    if(request.project.toString() !== ProjectId){
        throw new ApiError(403,"Request is not a part of project")
    }

    return {project,collection,request}
}


const buildQueryParams = (queryParams=[])=>{

    return queryParams.reduce((params,item)=>{
        if(item.enabled && item.key){
            params[item.key] = item.value
        }
        return params
    },{})
    
}

const buildHeaders  = (headers=[])=>{

    return headers.reduce((acc,header)=>{
        if(header.enabled && header.key){
            acc[header.key] = header.value
        }
        return acc
    },{})

}
