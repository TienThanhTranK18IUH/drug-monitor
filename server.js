const express = require('express');              // Express framework
const app = express();
const bodyParser = require('body-parser');       // Middleware parse form-data
const dotenv = require('dotenv').config();       // Load biến môi trường từ .env
const morgan = require('morgan');                // Log HTTP requests
const connectMongo = require('./server/database/connect'); // Kết nối MongoDB
const PORT = process.env.PORT || 3100;           // Port từ .env hoặc mặc định 3100

// ---- Middleware ----

// EJS view engine
app.set('view engine', 'ejs');

// Parse form data (application/x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON body (application/json) → rất quan trọng để nhận dữ liệu từ Postman
app.use(express.json());

// Serve static files từ thư mục "assets"
app.use(express.static('assets'));

// HTTP request logger
app.use(morgan('tiny'));

// ---- Database ----
connectMongo(); 

// ---- Routes ----
app.use('/', require('./server/routes/routes'));

// ---- Start server ----
app.listen(PORT, function () {
  console.log('listening on ' + PORT);
  console.log(`Welcome to the Drug Monitor App at http://localhost:${PORT}`);
});
