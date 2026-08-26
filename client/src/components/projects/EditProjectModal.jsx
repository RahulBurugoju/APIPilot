import React from "react";
import Modal from "../common/Modal";
import EditProjectForm from "./EditProjectForm";
import { Edit2 } from "lucide-react";

function EditProjectModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project Details"
      icon={Edit2}
    >
      <EditProjectForm onCancel={onClose} onSuccess={onClose} />
    </Modal>
  );
}

export default EditProjectModal;
