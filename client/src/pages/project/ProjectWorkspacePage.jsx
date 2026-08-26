import React from 'react'
import { useParams } from 'react-router-dom'

function ProjectWorkspacePage() {
    const {projectId} = useParams();
    
  return (
    <div>ProjectWorkspacePage  {projectId}</div>
  )
}

export default ProjectWorkspacePage