import Client from "replitobject-storage";

const client = new Client();

export async function uploadFileToObjectStorage(file) {
  const arrayBuffer = await file.arrayBuffer();
  const filename = `${Date.now()}-${file.name}`;
  const ok = await client.uploadFromBytes(filename, new Uint8Array(arrayBuffer));
  if (!ok) throw new Error("Upload failed");
  return filename;
}

export async function getFileUrl(filename) {
  // Object Storage serves files at a predictable URL pattern
  // Replace <bucket-name> with your actual bucket name if needed
  return client.getDownloadUrl(filename);
}
