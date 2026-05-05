const {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const multer = require("multer");
const processImageBuffer = require("./processImageBuffer");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const UPLOADS_FOLDER = "uploads/";

// ✅ Use memory storage (IMPORTANT)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
     fileSize: 300 * 1024 * 1024
  },
});

// ======================================================
// ✅ Upload Single File (Compressed + WebP)
// ======================================================
const uploadFile = async (file) => {
  try {
    const bucketName = process.env.S3_BUCKET_NAME;

    const processedBuffer = await processImageBuffer(file.buffer);

    const fileName = `${UPLOADS_FOLDER}${Date.now()}-${Math.random()}.webp`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: processedBuffer,
        ContentType: "image/webp",
      })
    );

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return {
      status: true,
      fileUrl,
      message: "File uploaded successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

// ======================================================
// ✅ Upload Multiple Files
// ======================================================
const uploadMultipleFiles = async (files = []) => {
  try {
    const results = [];

    for (const file of files) {
      const res = await uploadFile(file);
      results.push(res.fileUrl);
    }

    return {
      status: true,
      fileUrls: results,
      message: "Files uploaded successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

// ======================================================
// ✅ Delete Single File
// ======================================================
const deleteFile = async (fileUrl) => {
  const bucketName = process.env.S3_BUCKET_NAME;

  let key = decodeURIComponent(
    fileUrl.split(
      `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`
    )[1]
  );

  if (!key || !key.startsWith(UPLOADS_FOLDER)) {
    return { status: false, message: "Invalid file URL" };
  }

  try {
    await s3Client.send(
      new HeadObjectCommand({ Bucket: bucketName, Key: key })
    );

    await s3Client.send(
      new DeleteObjectCommand({ Bucket: bucketName, Key: key })
    );

    return { status: true, message: "File deleted successfully" };
  } catch (error) {
    return {
      status: false,
      message: error.name === "NotFound" ? "File not found" : error.message,
    };
  }
};

// ======================================================
// ✅ Delete Multiple Files
// ======================================================
const deleteMultipleFiles = async (fileUrls = []) => {
  const results = [];

  for (const url of fileUrls) {
    const res = await deleteFile(url);
    results.push({ url, ...res });
  }

  return {
    status: true,
    results,
  };
};

module.exports = {
  upload,
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  deleteMultipleFiles,
};