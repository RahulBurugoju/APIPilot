import React from "react";
import Modal from "../common/Modal";
import CreateCollectionForm from "./CreateCollectionForm";
import { FolderPlus } from "lucide-react";

function CreateCollectionModal({
  isOpen,
  onClose,
  projectId,
  parentCollection = null,
  parentId = null,
}) {
  const isSubCollection = Boolean(parentCollection || parentId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSubCollection ? "Create Sub-Collection" : "Create Collection"}
      description={
        isSubCollection
          ? `Create a nested collection under "${parentCollection?.name || "Parent Collection"}"`
          : "Group related requests, endpoints, and headers together."
      }
      icon={FolderPlus}
      maxWidth="max-w-md"
    >
      <CreateCollectionForm
        projectId={projectId}
        parentCollection={parentCollection}
        parentId={parentId}
        onCancel={onClose}
        onSuccess={onClose}
        isModal={true}
      />
    </Modal>
  );
}

export default CreateCollectionModal;
