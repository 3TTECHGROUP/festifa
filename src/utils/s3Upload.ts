import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

console.log('AWS Config:', {
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID?.substring(0, 4) + '***',
  region: import.meta.env.VITE_AWS_REGION,
  bucket: import.meta.env.VITE_AWS_BUCKET,
});

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION || 'eu-west-2',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

// Ensure key is ASCII-safe and stable to avoid signature/encoding mismatches
function slugifyFilename(name: string) {
  const dot = name.lastIndexOf('.');
  const base = dot >= 0 ? name.slice(0, dot) : name;
  const ext = dot >= 0 ? name.slice(dot + 1) : '';
  const safeBase = base
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return ext ? `${safeBase}.${ext.toLowerCase()}` : safeBase;
}

export type S3UploadResult = { url: string; key: string };

export const uploadImageToS3 = async (file: File): Promise<S3UploadResult> => {
  const bucket = import.meta.env.VITE_AWS_BUCKET as string;
  const region = (import.meta.env.VITE_AWS_REGION as string) || 'eu-west-2';
  if (!bucket) throw new Error('Missing VITE_AWS_BUCKET env');
  const timestamp = Date.now();
  const fileName = `events/${timestamp}-${slugifyFilename(file.name)}`;

  try {
    // Convert File to ArrayBuffer for proper browser compatibility
    const arrayBuffer = await file.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: body,
      ContentType: file.type,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    // Always return the public S3 URL for the uploaded object
    return { url: `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`, key: fileName };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload image to S3');
  }
};

export const deleteS3Object = async (key: string): Promise<void> => {
  const bucket = import.meta.env.VITE_AWS_BUCKET as string;
  if (!bucket) throw new Error('Missing VITE_AWS_BUCKET env');
  try {
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    // do not rethrow; deleting on cancel should be best-effort
  }
};
