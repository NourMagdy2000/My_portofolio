const sql = require('mssql');
const httpStatusText = require('../utils/strings/httpStatusText');
const async_wrapper = require('../middleware/async_middleware');
const appError = require('../utils/functions/appError');
const e = require('express');

let AppError = require('../utils/functions/appError');
let { validationResult, body } = require('express-validator');
require('dotenv').config();




const config = {
    user: 'CloudSAba94683c', // Replace with your database username
    password: 'Nero1482000', // Replace with your database password
    server: 'my-website.database.windows.net', // Replace with your Azure SQL server name
    database: 'my_database', // Replace with your database name
    options: {
        encrypt: true, // Enable if your database requires encryption (default for Azure)
        trustServerCertificate: false // Change to true if you're testing locally and have certificate issues
    }
};


const get_my_personal_data = async_wrapper(async (req, res, next) => {


    try {
        const pool = await sql.connect(config);

        const result = await pool.request().query('SELECT * FROM my_personal_data');
        const data = result.recordset;

        res.status(200).json({ status: httpStatusText.SUCCESS, "data": data, "message": "success" });

        await pool.close();
    } catch (error) {
const serverError = appError.createError(400, error.message, httpStatusText.FAIL);

        return next(serverError);
    }
});






const insertPersonalData = async (req, res,next) => {
    // Data to be inserted (can also be retrieved from req.body)
    const {  name, age, phone, title, description } = req.body; // Example input fields

    let errors = validationResult(req.body);
    // Extract uploaded files
    const imageFile = req.files?.image?.[0]; // Image file
    const cvFile = req.files?.cv?.[0]; 
    if (!errors.isEmpty()) {
        const error = appError.createError(400, errors.array(), httpStatusText.FAIL);
        return next(error);
    }
    else {
    // Validate file uploads
    if (!imageFile || !cvFile) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'Both image and CV files are required.',
        });
    }

        try {

                   // File paths
        const imagePath = imageFile.filename; // Path to the uploaded image
        const cvPath = cvFile.filename; 
            // Connect to the database
            const pool = await sql.connect(config);
     
            // Write the INSERT query
            const query = `
            INSERT INTO my_personal_data (name, age, phone,title,description,image,cv)
            VALUES (@name, @age, @phone,@title,@description,@image,@cv)
        `;

            // Execute the query with parameterized input nchar(40)
            const result2 = await pool.request()
                .input('name', sql.NVarChar, name)
                .input('age', sql.Int, age)
                .input('phone', sql.Int, phone)
                .input('title', sql.NVarChar, title)
                .input('description', sql.Text, description)
                .input('image', sql.Text, imagePath).input('cv', sql.Text, cvPath)
                .query(query);

            // Close the database connection
            await pool.close();
            // Respond with success
            res.status(201).json({ status: httpStatusText.SUCCESS, message: 'Data inserted successfully!', result: req.body });
        } catch (error) {
            res.status(500).json({ status: httpStatusText.FAIL, message: error.message });
        }
    }


};

const updatePersonalData = async (req, res, next) => {
    // Data to be inserted (can also be retrieved from req.body)
    const { name, age, phone, title, description } = req.body; // Example input fields
    let id = req.params.id;

    const errors = validationResult(req.body);


    let image = req.file.filename;
    if (!errors.isEmpty()) {
        const error = appError.createError(400, errors.array(), httpStatusText.FAIL);
        return next(error);
    }
    else {


        try {
            // Connect to the database
            const pool = await sql.connect(config);

            // Write the INSERT query
            const query = `
            UPDATE my_personal_data
            SET name = @name, phone = @phone, title = @title, description = @description, image = @image, age = @age
            WHERE id = @id
        `;

            // Execute the query with parameterized input nchar(40)
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('name', sql.NVarChar, name)
                .input('age', sql.Int, age)
                .input('phone', sql.Int, phone)
                .input('title', sql.NVarChar, title)
                .input('description', sql.Text, description)
                .input('image', sql.Text, image)
                .query(query);

            // Close the database connection
            await pool.close();
            // Respond with success
            res.status(201).json({ status: httpStatusText.SUCCESS, message: 'Data updated successfully!', updatedData: req.body });
        } catch (error) {
            res.status(500).json({ status: httpStatusText.FAIL, message: error.message });

        }
    }
};
let deleteCourse = async_wrapper(async (req, res, next) => {

    let id = req.params.id;


    try {
        // Connect to the database
        const pool = await sql.connect(config);

        // Write the INSERT query
        const query = `
         DELETE  FROM my_personal_data
 WHERE id = @id;

        `;

        // Execute the query with parameterized input nchar(40)
        const result = await pool.request()
            .input('id', sql.Int, id)

            .query(query);

        // Close the database connection
        await pool.close();
        // Respond with success
        res.status(201).json({ status: httpStatusText.SUCCESS, message: 'Data deleted successfully!' });
    } catch (error) {
        res.status(500).json({ status: httpStatusText.FAIL, message: error.message });
    }

});

module.exports = { insertPersonalData, get_my_personal_data, updatePersonalData, deleteCourse };

