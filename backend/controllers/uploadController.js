const multer = require('multer');
const path = require('path');
const { BlobServiceClient } = require('@azure/storage-blob');

// Use memory storage so we can buffer the image and send it directly to Azure
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Check if Azure is configured
    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      return res.status(500).json({ success: false, message: 'Azure Storage not configured' });
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'uploads';
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const blobName = req.file.fieldname + '-' + uniqueSuffix + path.extname(req.file.originalname);
    
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload to Azure
    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype }
    });

    const imageUrl = blockBlobClient.url;
    res.json({ success: true, url: imageUrl });
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, uploadImage };
