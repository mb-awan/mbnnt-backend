import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';

import { env } from '@/common/utils/envConfig';

export const UploadProfilePicture = multer({ dest: 'public/profilePictures' }).single('profilePicture');

export const uploadFileToCloudinary = async (filePath: string) => {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    //  cloud_name: "dnxjwbqtw",
    //   api_key:"853386892647684",
    //   api_secret:"FmUNwdXY-p-mP1mGzNA2NCPmt9I",
  });
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    });
    fs.unlinkSync(filePath);
    return result;
  } catch (error: any) {
    fs.unlinkSync(filePath);
    throw new Error(error.message);
  }
};

export const deleteFileFromCloudinary = async (url: string) => {
  const publicId = url.split('/').pop()?.split('.')[0];
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    } else {
      throw new Error('Invalid URL');
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// // set Storage

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../../../../public/profilePicture'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   },
// });

// // initialize upload multer

// export const Upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // Limit file size to 1MB
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// }).single('profilePicture'); // 'profilePic' is the name attribute in your form

// // Check file type
// function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error('message : Images Only!'));
//   }
// }
