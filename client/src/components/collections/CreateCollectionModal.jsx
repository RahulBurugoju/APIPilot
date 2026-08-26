import React from "react";
import Modal from "../common/Modal";
import CreateCollectionForm from "./CreateCollectionForm";
import { FolderPlus } from "lucide-react";

function CreateCollectionModal({ isOpen, onClose, projectId }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Collection"
      description="Group related requests, endpoints, and headers together."
      icon={FolderPlus}
      maxWidth="max-w-md"
    >
      <CreateCollectionForm
        projectId={projectId}
        onCancel={onClose}
        onSuccess={onClose}
        isModal={true}
      />
    </Modal>
  );
}

export default CreateCollectionModal;
