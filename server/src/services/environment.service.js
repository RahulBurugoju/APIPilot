import Environment from "../models/environment.model.js";
import { ApiError } from "../utils/ApiError.js";


const createEnvironment = async ({ projectId, name, variables, isActive }) => {
    if (isActive) {
        // Deactivate all existing environments in this project
        await Environment.updateMany(
            { project: projectId },
            { $set: { isActive: false } }
        );
    }

    const environment = await Environment.create({
        name,
        project: projectId,
        variables,
        isActive: !!isActive
    });

    if (!environment) {
        throw new ApiError(500, "Failed to create environment");
    }

    return environment;
};

const getProjectEnvironments = async ({ projectId }) => {
    const environments = await Environment.find({
        project: projectId
    });

    if (!environments) {
        throw new ApiError(500, "Failed to get environments");
    }

    return environments;
};

const getEnvironmentById = async ({ environmentId, projectId }) => {
    const environment = await Environment.findOne({
        _id: environmentId,
        project: projectId
    });

    if (!environment) {
        throw new ApiError(404, "Environment not found");
    }

    return environment;
};

const updateEnvironment = async ({ environmentId, projectId, name, variables, isActive }) => {
    const updateFields = {};
    if (name !== undefined) {
        updateFields.name = name;
    }
    if (variables !== undefined) {
        updateFields.variables = variables;
    }
    if (isActive !== undefined) {
        updateFields.isActive = isActive;
        if (isActive) {
            // Deactivate all other environments for this project
            await Environment.updateMany(
                { project: projectId, _id: { $ne: environmentId } },
                { $set: { isActive: false } }
            );
        }
    }

    const updatedEnvironment = await Environment.findOneAndUpdate(
        { _id: environmentId, project: projectId },
        {
            $set: updateFields
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedEnvironment) {
        throw new ApiError(404, "Environment not found");
    }
    return updatedEnvironment;
};

const deleteEnvironment = async ({ environmentId, projectId }) => {
    const environment = await Environment.findOneAndDelete(
        { _id: environmentId, project: projectId },
        {
            new: true,
            runValidators: true
        }
    );
    if (!environment) {
        throw new ApiError(404, "Environment not found");
    }
    return environment;
};

const setActiveEnvironment = async ({ environmentId, projectId }) => {
    // 1. Verify target environment exists and belongs to project
    const targetEnv = await Environment.findOne({
        _id: environmentId,
        project: projectId
    });

    if (!targetEnv) {
        throw new ApiError(404, "Environment not found");
    }

    // 2. Set all other environments in the project to inactive
    await Environment.updateMany(
        { project: projectId, _id: { $ne: environmentId } },
        {
            $set: {
                isActive: false
            }
        }
    );

    // 3. Set the target environment to active
    targetEnv.isActive = true;
    await targetEnv.save();

    return targetEnv;
};

export default {
    createEnvironment,
    getProjectEnvironments,
    getEnvironmentById,
    updateEnvironment,
    deleteEnvironment,
    setActiveEnvironment    
};