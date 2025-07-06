import React, { useRef } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadButton({ onFile }) {
  const inputRef = useRef(null);

  const handleFiles = files => {
    if (files && files.length > 0) {
      onFile && onFile(files[0]);
    }
  };

  return (
    <div
      className="flex items-center gap-2"
      onClick={() => inputRef.current && inputRef.current.click()}
      onDrop={e => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      onDragOver={e => e.preventDefault()}
      style={{ cursor: "pointer" }}
    >
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold shadow hover:bg-blue-100 transition-all"
      >
        <UploadCloud className="w-5 h-5" />
        <span>Upload</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  );
}
