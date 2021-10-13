const Sauce = require("../models/Sauce");


// Like / Dislike une sauce
function likeSauce(Sauce, req, res) { //Methode update pour mettre à jour le like / Définit le statut « Like » pour l' userId fourni. 
    return Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId } })
    .then(() => res.status(200).json({ message: 'Ajout Like' }))
    .catch(error => res.status(400).json({ error }))
} 
function dislikeSauce(Sauce, req, res) { //Methode update pour mettre à jour le dislike / Définit le statut « Dislike » pour l' userId fourni.
    return Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId } })
    .then(() => res.status(200).json({ message: 'Ajout Dislike' }))
    .catch(error => res.status(400).json({ error }))
} 
function likeDislike(Sauce, req, res) { // if (like === 0) { Annulation d'un like ou dislike
    return Sauce.findOne({ _id: req.params.id }) //Methode findOne pour trouver la sauce unique ayant le même id
    .then(sauce => {
        if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                .then(() => { res.status(200).json({ message: 'Suppression Like' }) })
                .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                .then(() => { res.status(200).json({ message: 'Suppression Dislike' }) })
                .catch(error => res.status(400).json({ error }))
            }
        })
    .catch(error => res.status(400).json({ error }))
};

exports.likeSauce = likeSauce;
exports.dislikeSauce = dislikeSauce;
exports.likeDislike = likeDislike;