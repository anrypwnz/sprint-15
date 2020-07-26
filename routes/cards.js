const router = require('express').Router();
const bodyParser = require('body-parser');
const auth = require('../middlewares/auth');
const { createCard, getCard, delCard } = require('../controller/cards');

router.use(bodyParser.json());
router.get('/cards', auth, getCard);
router.delete('/cards/:id', auth, delCard);
router.post('/cards', auth, createCard);

module.exports = router;
