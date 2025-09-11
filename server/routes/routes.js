const express = require('express');
const route = express.Router();

// Services (render các trang ejs)
const services = require('../services/render');

// Controller (CRUD logic)
const controller = require('../controller/controller');

// Middleware validate drug input
const validateDrug = require('../middleware/validateDrug');

// ------------------- RENDER PAGES -------------------
route.get('/', services.home);
route.get('/manage', services.manage);
route.get('/dosage', services.dosage);
route.get('/purchase', services.purchase);
route.get('/add-drug', services.addDrug);
route.get('/update-drug', services.updateDrug);

// ------------------- API CRUD -------------------
// Create drug (validate input trước khi lưu)
route.post('/api/drugs', validateDrug, controller.create);

// Get all drugs / get by id
route.get('/api/drugs', controller.find);

// Update drug
route.put('/api/drugs/:id', validateDrug, controller.update);

// Delete drug
route.delete('/api/drugs/:id', controller.delete);

// ------------------- PURCHASE -------------------
// Purchase function (mua thuốc)
route.post('/api/drugs/:id/purchase', controller.purchase);

module.exports = route;
