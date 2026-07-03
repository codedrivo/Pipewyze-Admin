import React from "react";

interface FilePreviewProps {
  file?: File | null | any;
  url?: string;
  label?: string;
}

/**
 * A reusable component to preview files (images/PDFs) and provide a link to view them.
 * Handles both new File objects (from input) and existing URLs (from backend).
 */
const FilePreview: React.FC<FilePreviewProps> = ({ file, url, label }) => {
  if (!file && !url) return null;

  const isImage = file
    ? file.type?.startsWith("image/")
    : url?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) != null;

  const displayUrl = file ? URL.createObjectURL(file) : url;

  return (
    <div
      className="file-preview-wrap"
      style={{
        marginTop: "8px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {isImage ? (
        <img
          src={displayUrl}
          alt="Preview"
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
      ) : (
        <div
          style={{
            padding: "4px 8px",
            background: "#f0f0f0",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#666",
            border: "1px solid #ddd",
          }}
        >
          📄 PDF
        </div>
      )}
      <a
        href={displayUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          fontSize: "12px",
          color: "var(--gc-primary)",
          textDecoration: "underline",
          fontWeight: 600,
        }}
      >
        {label || (file ? "New File Preview" : "View File")}
      </a>
    </div>
  );
};

export default FilePreview;
