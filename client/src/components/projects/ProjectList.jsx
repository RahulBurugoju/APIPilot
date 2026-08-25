import { useSelector } from "react-redux";

import ProjectCard from "./ProjectCard";

const ProjectList = () => {
  const { projects, loading, error } =
    useSelector(
      (state) => state.project
    );

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return (
      <p>
        {error.message ||
          "Failed to load projects"}
      </p>
    );
  }

  if (projects.length === 0) {
    return (
      <div>
        <h3>No projects yet</h3>

        <p>
          Create your first API project
          to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
        />
      ))}
    </div>
  );
};

export default ProjectList;