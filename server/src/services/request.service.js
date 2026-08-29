import mongoose from "mongoose"
import Request from "../models/request.model.js"
import { ApiError } from "../utils/ApiError.js" 


const createRequest = async({name,method,url,collectionId,headers,queryParams,body,order})=>{
    
    const request = await Request.create({
        name,
        method,
        url,
        collection:collectionId,
        headers,
        queryParams,
        body,
        order
    })

    if(!request){
        throw new ApiError(500,"Failed to create request")
    }

    return request; 
}

const getCollectionRequests = async({collectionId,projectId})=>{
    const requests  = await Request.find({
        collection:collectionId
    }).sort({order:1});

    if(requests.length===0){
        throw new ApiError(404,"No requests found in this collection")
    }

    return requests;
}

const getRequest = async({requestId,collectionId})=>{
    const request = await Request.find({
        _id:requestId,
        collection:collectionId
    })

    if(!request){
        throw new ApiError(404,"Request not found")
    }

    return request;
}

const updateRequest = async({requestId,collectionId,name,method,url,headers,queryParams,body,order})=>{

    const updateFileds = {};

    if(name !== undefined){
        updateFileds.name = name;
    }
    if(method !== undefined){
        updateFileds.method = method;
    }
    if(url !== undefined){
        updateFileds.url = url;
    }
    if(headers !== undefined){
        updateFileds.headers = headers;
    }
    if(queryParams !== undefined){
        updateFileds.queryParams = queryParams;
    }
    if(body !== undefined){
        updateFileds.body = body;
    }
    if(order !== undefined){
        updateFileds.order = order;
    }

    const request = await Request.findOneAndUpdate(
        {
            _id:requestId,
            collection:collectionId
        },
        updateFileds,
        {
            new:true,
            runValidators:true
        }
    )
    
    if(!request){
        throw new ApiError(500,"Failed to update request")
    }
    
    return request;
}

const deleteRequest = async({requestId,collectionId})=>{
    const request = await Request.findOneAndDelete(
        {
            _id:requestId,
            collection:collectionId
        }
    )
    
    if(!request){
        throw new ApiError(500,"Failed to delete request")
    }
    
    return request;
}

export default {
    createRequest,
    getCollectionRequests,
    getRequest,
    updateRequest,
    deleteRequest   
}