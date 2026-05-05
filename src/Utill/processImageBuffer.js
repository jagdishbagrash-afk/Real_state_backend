const sharp = require("sharp");

const processImageBuffer = async (buffer) => {
  return await sharp(buffer)
    .resize({ width: 1200 })
    .webp({ quality: 70 })
    .toBuffer();
};

module.exports = processImageBuffer;