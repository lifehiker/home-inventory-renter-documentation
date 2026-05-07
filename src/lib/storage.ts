import fs from "fs";
import path from "path";

const LOCAL_UPLOAD_DIR = "/tmp/depositsafe-uploads";

function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
    fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
  }
}

function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

export async function uploadFile(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  if (isR2Configured()) {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );
  } else {
    ensureLocalDir();
    const safeKey = key.replace(/\//g, "_");
    const filePath = path.join(LOCAL_UPLOAD_DIR, safeKey);
    fs.writeFileSync(filePath, buffer);
  }
}

export async function getFileUrl(key: string): Promise<string> {
  if (isR2Configured()) {
    if (process.env.R2_PUBLIC_URL) {
      return `${process.env.R2_PUBLIC_URL}/${key}`;
    }
    const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    return getSignedUrl(s3, new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }), { expiresIn: 3600 });
  } else {
    const safeKey = key.replace(/\//g, "_");
    return `/api/files/${safeKey}`;
  }
}

export async function getThumbnailUrl(thumbnailKey: string): Promise<string> {
  return getFileUrl(thumbnailKey);
}

export async function getFileBuffer(key: string): Promise<Buffer | null> {
  if (isR2Configured()) {
    const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    try {
      const response = await s3.send(new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      }));
      const chunks: Uint8Array[] = [];
      if (response.Body) {
        const reader = (response.Body as AsyncIterable<Uint8Array>)[Symbol.asyncIterator]();
        let result = await reader.next();
        while (!result.done) {
          chunks.push(result.value);
          result = await reader.next();
        }
      }
      return Buffer.concat(chunks);
    } catch {
      return null;
    }
  } else {
    ensureLocalDir();
    const safeKey = key.replace(/\//g, "_");
    const filePath = path.join(LOCAL_UPLOAD_DIR, safeKey);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    }
    return null;
  }
}
