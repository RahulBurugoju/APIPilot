const ProjectCard = ({ project }) => {
  return (
    <div>
      <h3>{project.name}</h3>

      <p>
        {project.description ||
          "No description"}
      </p>

      <span>
        Updated{" "}
        {new Date(
          project.updatedAt
        ).toLocaleDateString()}
      </span>
    </div>
  );
};

export default ProjectCard;