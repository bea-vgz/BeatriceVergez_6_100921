const mongoose = require('mongoose');
const uniqueValidator = require ('mongoose-unique-validator');

// Deux utilisateurs ne peuvent pas utiliser la même adresse mail - éléments uniques
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // L'ajout de unique validator rend impossible d'avoir plusieurs utilisateurs inscrits avec la même adresse mail

module.exports = mongoose.model('User', userSchema);