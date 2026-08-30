import React from "react";
import Modal from "../common/Modal";
import CreateProjectForm from "./CreateProjectForm";
import { FolderPlus } from "lucide-react";

export default function CreateProjectModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Scaffold a new API workspace for collections and environments."
      icon={FolderPlus}
      maxWidth="max-w-md"
    >
      <CreateProjectForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
}
