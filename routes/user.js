'use strict'

var express = require('express');
var UserControllers = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

api.get('/probando-controlador', md_auth.ensureAuth, UserControllers.pruebas);
api.post('/register', UserControllers.saveUser);
api.post('/login', UserControllers.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserControllers.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserControllers.uploadImage);
api.get('/get-image-user/:imageFile', UserControllers.getImageFile);

module.exports = api;
