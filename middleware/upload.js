const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// On configure le storage pour envoyer directement vers Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "rental-agency-vehicles", // nom du dossier dans Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }], // optionnel
  },
});

const upload = multer({ storage });

module.exports = upload;
