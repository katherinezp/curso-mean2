'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/curso-mean2', (err, res) => {
    if(err)
        throw err;
    else {
        console.log('La conexión a la base de datos esta funcionando correctamente.');

        app.listen(port, function() {
            console.log('El servidor API REST esta corriendo en el puerto: '+port);
        });
    }
});
