const httpStatusText = require('../utils/strings/httpStatusText')

const multer = require('multer');
// Disk storage configuration
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the "uploads" directory
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]; // Get file extension
        const uniqueName = `${file.fieldname}-${Date.now()}.${ext}`;
        cb(null, uniqueName); // Save files with a unique name
    }
});

// File filter function to accept images and PDFs
const typeFilter = (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];
    const isImage = fileType === "image";
    const isPDF = file.mimetype === "application/pdf";

    if (isImage || isPDF) {
        cb(null, true); // Accept the file
    } else {
        const appError = require('../utils/functions/appError');
        const httpStatusText = require('../utils/strings/httpStatusText');
        const error = appError.createError(400, "Only image or PDF files are allowed.", httpStatusText.ERROR);
        cb(error, false); // Reject the file
    }
};

const upload = multer({ storage: diskStorage, fileFilter: typeFilter });
const express = require("express");
const my_personal_data_controller = require('../controllers/my_personal_data_controller');
const router = express.Router();
const {personal_data_validation} = require('../middleware/personal_data_validatitor');


router.route('/').get(my_personal_data_controller.get_my_personal_data).
    post( personal_data_validation(), upload.fields([
        { name: 'image', maxCount: 1 }, // For image uploads
        { name: 'cv', maxCount: 1 }    // For CV (PDF) uploads
    ]),my_personal_data_controller.insertPersonalData);
router.route('/:id').patch(personal_data_validation(), upload.fields([
    { name: 'image', maxCount: 1 }, // For image uploads
    { name: 'cv', maxCount: 1 }    // For CV (PDF) uploads
]),my_personal_data_controller.updatePersonalData).delete(my_personal_data_controller.deleteCourse);


module.exports = router;    