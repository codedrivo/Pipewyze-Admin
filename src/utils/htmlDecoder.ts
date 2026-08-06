export function decodeHTMLEntities(text: string): string {
  if (!text) return "";
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  let decoded = textarea.value;
  // Handle double-encoded values if any
  while (
    decoded.includes("&lt;") ||
    decoded.includes("&gt;") ||
    decoded.includes("&amp;") ||
    decoded.includes("&quot;")
  ) {
    textarea.innerHTML = decoded;
    decoded = textarea.value;
  }
  return decoded;
}
