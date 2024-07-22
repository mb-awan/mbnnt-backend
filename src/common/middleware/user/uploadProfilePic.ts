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
