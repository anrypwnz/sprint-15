const router = require('express').Router();
const bodyParser = require('body-parser');
const auth = require('../middlewares/auth');

const {
  createUser, getUser, getUsers, login,
} = require('../controller/users');

router.use(bodyParser.json());
router.get('/users', auth, getUsers);
router.get('/users/:id', auth, getUser);
router.post('/signup', createUser);
router.post('/signin', login);

module.exports = router;
