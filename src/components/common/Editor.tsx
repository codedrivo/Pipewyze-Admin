import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
  ];

  return (
    <div className='custom-editor-wrapper'>
      <ReactQuill
        theme='snow'
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Type here..."}
      />
    </div>
  );
};

export default Editor;
