'user strict'
var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function pruebas(req, res) {

    res.status(200).send({
        mesagge: 'probando una accion de controlador'
    });
}

function saveUser(req, res) {

    var user = new User();
    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password) {
        //encriptar contraseña
        bcrypt.hash(params.password, null, null, function(err, hash) {
        user.password = hash;
        
        if(user.name != null && user.surname != null && user.email != null) {
            user.save((err, userStored) => {

                if(err) {
                    res.status(500).send({mesagge: 'Error al registrar el usuario.'});
                }else {
                    if(!userStored){
                        res.status(404).send({mesagge: 'No se ha registrado el usuario.'});
                    } else {
                        res.status(200).send({user: userStored});
                    }
                }
            });

        } else {
            res.status(200).send({mesagge: 'Ingrese todos los campos.'});
        }

        })
    }else {
        res.status(200).send({mesagge: 'Ingrese la contraseña.'});
    }
}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err) {
            res.status(500).send({mesagge: 'Error en la petición.'});
        }else {
            if(!user) {
                res.status(404).send({mesagge: 'Usuario no existe.'});
            }else {
                bcrypt.compare(password, user.password, function(err, check) {
                
                    if(check) {
                        //devolver usuario logueado
                        if(params.gethash){
                            //devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({mesagge: user});
                        }
                    }else {
                        res.status(404).send({mesagge: 'El usuario no ha podido loguearse.'});
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    user.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if(err) {
            res.status(500).send({mesagge: 'Error al actualizar el usuario.'});
        } else {
            if(!userUpdated) {
                res.status(404).send({mesagge: 'No se ha podido actualizar el usuario.'});
            } else {
                res.status(200).send({mesagge: "El usuario se ha actualizado."});
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'imagen no subida...';

    //console.log(userId);
    //console.log(req.params);
    console.log(req.files);
    if(req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if(file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'png') {
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {

            if(err) {
                res.status(500).send({mesagge: 'Error al actualizar el usuario.'});
            } else {
                if(!userUpdated) {
                    res.status(404).send({mesagge: 'No se ha podido actualizar el usuario.'});
                } else {
                    res.status(200).send({mesagge: "El usuario se ha actualizado."});
                }
            }
            })
        }else {
            res.status(200).send({mesagge: 'Formato incorrecto.'});
        }

        console.log(file_ext);
    }else {
        res.status(200).send({mesagge: 'no ha subido ninguna imagen.'});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;

    fs.exists(path_file, function(exists) {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else {
            res.status(200).send({mesagge: 'No existe la imagen.'});
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};