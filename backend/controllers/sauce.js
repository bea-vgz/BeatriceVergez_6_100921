const Sauce = require('../models/Sauce'); // Import du modèle sauce créé dans le dossier models/Sauce.js
const fs = require('fs'); // Import de fileSystem de node pour avoir accès aux différentes opérations liées au système de fichier (suppression image)
const functions = require("../Services/sauces");

// Création d'une nouvelle instance du modèle Sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); //req.body.sauce sera un objet JS sous forme chaîne de caractère
  delete sauceObject._id; // On enlève le champs id du corps de la requête car MongoDB en génère un automatiquement
  const sauce = new Sauce({ // Creation d'une nouvelle instance du modèle Sauce qui va contenir toutes les informations requises
      ...sauceObject, //Le spread operator, qui se présente sous la forme de points de suspension, copie tous les éléments de req.body
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Génère url de l'image
  });
  // Méthode save() qui enregistre l'objet Sauce dans la BDD et retourne une Promise */
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée!'}))
    .catch(error => res.status(400).json({ error }));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => { //soit on change l'image si une nouvelle est fournie soit on modifie juste le corps de la requête
  functions.modifySauce(Sauce, req, res);
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => { // suppression de l'image dans le dossier
          Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
  .catch(error => res.status(500).json({ error }));
};
//Utilisation de l'Id reçu en paramètre pour accéder à la sauce correspondante dans la base de donnée. 
//L'url d'image contient un segment /images/ pour séparer le nom du fichier. 
//Supression de la sauce dans la base de donnée


// Afficher/Récupérer une sauce 
exports.getOneSauce = (req, res, next) => { // Methode pour trouver une sauce unique
  Sauce.findOne({ _id: req.params.id }) // //La sauce est retournée dans une promesse envoyée au front
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }));
};

// Afficher/Récupérer toutes les sauces / renvoie un tableau contenant toutes les sauces dans la BDD
exports.getAllSauces = (req, res, next) => {
  Sauce.find() 
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};

// Fonction pour "liker" ou "disliker" une sauce
// Un seul like ou dislike par user 
exports.likeDislikeSauce = (req, res, next) => {
  if (req.body.like === 1) {
    functions.likeSauce(Sauce, req, res);
  } else if (req.body.like === -1) {
    functions.dislikeSauce(Sauce, req, res);
  } else {
    functions.likeDislike(Sauce, req, res);
  }
}; 
