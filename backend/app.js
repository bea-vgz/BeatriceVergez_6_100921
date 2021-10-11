// Installation du framework Express et import dans le fichier app.js
const express = require('express'); 
// Installation de bodyParser et require pour pouvoir lire les requetes du body
const bodyParser = require('body-parser'); 
// Import mongoose pour faciliter les interactions avec la base de données MongoDB
const mongoose = require('mongoose'); 
const mongoSanitize = require('express-mongo-sanitize');
// Utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
const helmet = require('helmet'); 
// Import node pour accéder au path du serveur / donne accès au chemin de notre système de fichier
const path = require('path');

require('dotenv').config();

//Import des routers créés
const sauceRoutes = require('./routes/sauce'); // On importe la route dédiée aux sauces
const userRoutes = require('./routes/user'); // On importe la route dédiée aux utilisateurs

// Connection à la base de données MongoDB avec la sécurité vers le fichier .env pour cacher le MDP
// L'un des avantages que nous avons à utiliser Mongoose pour gérer notre base de données MongoDB est que nous pouvons implémenter des schémas de données stricts
// qui permettent de rendre notre application plus robuste
mongoose.connect(process.env.DB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); // Permet de créer une application express

// CORS - Cross Origin Resource Sharing (mesure de sécurité pour empêcher l'utilisation de ressources par des origines non-autorisées.)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
    
app.use(express.json());
    
app.use(mongoSanitize());
    
app.use(helmet());
    
app.use('/images', express.static(path.join(__dirname, 'images'))); //middleware pour la Gestion de la ressource image de façon statique
    
// ROUTES
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
    
// Exportation application
module.exports = app;