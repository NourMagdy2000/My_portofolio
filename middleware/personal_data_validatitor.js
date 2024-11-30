const { body } = require('express-validator');

const personal_data_validation = () => [
  body('name').isString().withMessage("name must be a string!")
    .notEmpty().withMessage("name must not be empty!")
    .isLength({ min: 2 }).withMessage("name must not be less than 2 characters!"),
  body('age')
    .notEmpty().withMessage("age must not be empty!")
    .isNumeric().withMessage("age must be a numeric value!")
    .isLength({ min: 2 }).withMessage("age must not be less than 2 digits!"),
  body('phone')
    .notEmpty().withMessage("Phone number must not be empty!")
    .isMobilePhone('ar-EG').withMessage("Invalid phone number! Must match the format 01000000000.")
];

module.exports ={ personal_data_validation};