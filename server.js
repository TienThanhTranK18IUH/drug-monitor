const express = require('express');              // Express framework
const app = express();
const bodyParser = require('body-parser');       // Middleware parse form-data
const dotenv = require('dotenv').config();       // Load biến môi trường từ .env
const morgan = require('morgan');                // Log HTTP requests
const connectMongo = require('./server/database/connect'); // Kết nối MongoDB
const path = require('path');
const PORT = process.env.PORT || 3100;           // Port từ .env hoặc mặc định 3100

// ---------------- MIDDLEWARE ---------------- //

// EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // optional: đảm bảo views trỏ đúng thư mục

// Parse form data (application/x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON body (application/json) → rất quan trọng để nhận dữ liệu từ Postman
app.use(express.json());

// Serve static files từ thư mục "assets"
app.use(express.static('assets'));

// HTTP request logger
app.use(morgan('tiny'));

// ---------------- DATABASE ---------------- //
connectMongo(); 

// ---------------- ROUTES ---------------- //
app.use('/', require('./server/routes/routes'));

// ---------------- ERROR HANDLERS ---------------- //

// 404 Handler
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error caught:", err.message);

  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {} // chỉ show stack trace ở DEV
  });
});

// ---------------- START SERVER ---------------- //
app.listen(PORT, function () {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`👉 Open: http://localhost:${PORT}`);
});
