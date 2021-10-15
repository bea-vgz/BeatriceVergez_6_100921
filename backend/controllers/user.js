const bcrypt = require('bcrypt'); //package de cryptage pour les mdp
const jwt = require('jsonwebtoken');
const User = require('../models/User'); //récupération de notre modèle User
const sauceServices = require("../services/users");

// Création d'un utilisateur :
exports.signup = (req, res, next) => {
    if (sauceServices.verifyPassword(req.body.password) && sauceServices.verifyEmail(req.body.email)) {
        bcrypt
        .hash(req.body.password, 10) //Execution de l'algorithme de hachage
        .then(hash => { // récupération le hash de MDP
            const user = new User({ //création une instance
                email: req.body.email,
                password: hash
            });
        user.save() // enregistrement cet utilisateur dans BDD
            .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès !' }))
            .catch(error => res.status(400).json({ error })); // erreur serveur
    })
    .catch(error => res.status(500).json({ error })); // erreur serveur 
    } else {
        res.status(400).json({ message : 'Mot de passe ou mail invalide'})
    }
};

exports.login = (req, res, next) => { // récupération du login
    User.findOne({ email: req.body.email })
        .then(user => { // si user non trouvé = erreur
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            }
            // comparaison avec le MDP envoyé dans la requete avec celui enregistré dans le user (BDD)
            bcrypt
                .compare(req.body.password, user.password)
                .then(valid => { // si pas bon = erreur
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !'});
                    } else { // envoi du Token
                        sauceServices.jwtToken(user._id, res);
                    }
                })
                .catch(error => res.status(500).json({ error }));
        })
    .catch(error => res.status(500).json({ error }));
};
