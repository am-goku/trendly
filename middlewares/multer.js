const multer = require('multer');



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