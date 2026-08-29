import KeyValueEditor from "./KeyValueEditor.jsx";

function ParamsEditor({ params = [], items, onChange }) {
  const actualItems = items !== undefined ? items : params;

  return (
    <KeyValueEditor
      title="Query Parameters"
      items={actualItems}
      onChange={onChange}
      keyPlaceholder="Key"
      valuePlaceholder="Value"
      addButtonLabel="+ Add Parameter"
      emptyMessage="No query parameters configured. Click '+ Add Parameter' to add one."
    />
  );
}

export default ParamsEditor;