const jwt = require('jsonwebtoken'); // pour importer le package jsonwebtoken
require('dotenv').config();

module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(' ')[1]; // on extrait le token du header Authorization de la requête entrante
      const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET); // on utilise la méthode verify pour décoder le token
      const userId = decodedToken.userId; // on extrait l'id utilisateur du token
      if (req.body.userId && req.body.userId !== userId) {
          throw 'User ID non valide';
      } else {
          next();
      }
  } catch(error) {
      return res.status(403).json({
          error: new Error('Requête non authentifiée')
      });
  }
};