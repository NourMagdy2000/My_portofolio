const sql = require('mssql');

// Azure SQL Database configuration
 config = {
  user:'CloudSAba94683c', // Replace with your database username
  password:'Nero1482000', // Replace with your database password
  server: 'my-website.database.windows.net', // Replace with your Azure SQL server name
  database: 'my database', // Replace with your database name
  options: {
    encrypt: true, // Enable if your database requires encryption (default for Azure)
    trustServerCertificate: false // Change to true if you're testing locally and have certificate issues
  }
};
async function connect() {
    try {
    await sql.connect(config);
      console.log('Connected to Azure SQL Database');
  
    } catch (err) {
      console.error('Error connecting to the database:', err.message);
    } 
  }

module.exports={connect};


