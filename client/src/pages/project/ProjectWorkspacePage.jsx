import React from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import projectThunks from '../../features/project/project.thunk'; 
import { useEffect } from 'react';

function ProjectWorkspacePage() {
    const {projectId} = useParams();

    const dispatch = useDispatch();

    const {currentProject,loading,error} = useSelector((state)=>state.project)

    useEffect(()=>{
        dispatch(projectThunks.getProject({projectId}))
    },[projectId,dispatch])
    
    
  return (
    <div>
        <div>

            <h1>ProjectWorkspace</h1>

            <h2>{currentProject?.name}</h2>
            <p>{currentProject?.description}</p>

            
        </div>
    </div>
  )
}

export default ProjectWorkspacePage