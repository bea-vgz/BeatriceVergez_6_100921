const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth')
const sauceCtrl = require('../controllers/sauce');

// IMPLEMENTATION DU CRUD (create, read, update, delete)
router.get('/', auth,sauceCtrl.getAllSauces) // read 
router.get('/:id', auth, sauceCtrl.getOneSauce) // read
router.post('/', auth, multer, sauceCtrl.createSauce); // create
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // update
router.delete('/:id', auth, sauceCtrl.deleteSauce); // delete
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);

module.exports = router;
