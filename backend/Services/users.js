const jwt = require("jsonwebtoken"); // pour importer le package jsonwebtoken

// fonction avec regex pour le MDP
function verifyPassword(password) {
    const passwordExp = RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"); // Doit contenir au moins 8 caractères, 1 Maj, 1 Chiffre
    if (passwordExp.test(password)) {
      console.log("Mot de passe correct");
      return true;
    } else {
      console.log("Mot de passe incorrect!");
      return false;
    }
}

// fonction avec regex pour le l'adresse mail
function verifyEmail(email) {
    const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Doit contenir un @ et un "."
    if (emailRegEx.test(email)) {
      console.log("Adresse mail correct");
      return true;
    } else {
      console.log("Adresse mail incorrecte!");
      return false;
    }
}

// fonction Token (envoi d'un token pour l'identification)
function jwtToken(userId, res) {
    return res.status(200).json({ // identifiant valable donc envoi de son user id + token bearer
        userId: userId,
        token: jwt.sign( // identification avec un TOKEN
            { userId: userId },
            process.env.JWT_TOKEN_SECRET, // utilisation d'une chaîne secrète de développement temporaire pour encoder le token
            { expiresIn: '24h' } // validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures
        ) 
    });
};

exports.verifyPassword = verifyPassword;
exports.verifyEmail = verifyEmail;
exports.jwtToken = jwtToken;