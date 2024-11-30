const httpStatusText = require('../utils/strings/httpStatusText')

const multer = require('multer');
const diskStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    }, filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const imageName = 'user-' + Date.now() + '.' + ext;
        cb(null, imageName)
    }
})

const typeFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image" || file.mimetype.split("/")[0].includes("image")) {
        cb(null, true);
    } else {
        const appError = require('../utils/functions/appError');
        const httpStatusText = require('../utils/strings/httpStatusText');
        const error = appError.createError(500, "Please upload only images.", httpStatusText.ERROR);
        cb(error, false);
    }
}
const upload = multer({ storage: diskStorage, fileFilter: typeFilter });
const express = require("express");
const my_personal_data_controller = require('../controllers/my_personal_data_controller');
const { body } = require('express-validator');
const router = express.Router();
const {personal_data_validation} = require('../middleware/personal_data_validatitor');


router.route('/').get(my_personal_data_controller.get_my_personal_data).
    post( personal_data_validation(),upload.single('image'),my_personal_data_controller.insertPersonalData);
router.route('/:id').patch(personal_data_validation(),upload.single('image'),my_personal_data_controller.updatePersonalData).delete(my_personal_data_controller.deleteCourse);


module.exports = router;    