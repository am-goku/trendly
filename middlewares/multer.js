const multer = require('multer');



/* This code is defining a disk storage engine for Multer, a middleware for handling file uploads in
Node.js. The `fileStorage` object specifies the destination directory for uploaded files, the
filename format for uploaded files (which includes a timestamp and the original filename), and a
file filter function that checks the file type and only allows jpeg and png files to be uploaded. */
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const newFilename = `${timestamp}_${file.originalname}.jpg`;
      cb(null, newFilename);
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          cb(new Error('Only jpeg and png files are allowed'));
          return;
        } else {
          cb(null, true);
          return;
        }
    }
});

const upload = multer({storage: fileStorage});


module.exports = upload;