import KeyValueEditor from "./KeyValueEditor.jsx";

function HeadersEditor({ headers = [], items, onChange }) {
  const actualItems = items !== undefined ? items : headers;

  return (
    <KeyValueEditor
      title="Headers"
      items={actualItems}
      onChange={onChange}
      keyPlaceholder="Header"
      valuePlaceholder="Value"
      addButtonLabel="+ Add Header"
      emptyMessage="No headers configured. Click '+ Add Header' to add one."
    />
  );
}

export default HeadersEditor;
