const jwt = require('jsonwebtoken'); // pour importer le package jsonwebtoken
require('dotenv').config();

module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(' ')[1];  // on sépare le bearer pour ne garder que le token
      const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET); // on utilise la méthode verify pour décoder le token
      const userId = decodedToken.userId; // on extrait l'id utilisateur du token
      if (req.body.userId && req.body.userId !== userId) {
          throw 'User ID non valide';
      } else {
        req.token = token;  
        req.user = userId;  // on ajoute l'id du user: cela servira à l'authentification pour les routes delete et put. 
        next(); 
      }
  } catch {
    res.status(401).json({error:error});
    }
};