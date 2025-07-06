export async function uploadChatFile(file: File): Promise<{ url: string; name: string }> {
  // TODO: Replace with real backend endpoint
  const formData = new FormData();
  formData.append("file", file);

  // Example: change URL to your backend file upload endpoint
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("File upload failed");
  return await res.json();
}
