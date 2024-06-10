const userCtrl = require('../controllers/userControl');
const auth = require('../middleware/auth');

const router = require('express').Router()

router.post('/register',userCtrl.register)
router.post('/refresh_token',userCtrl.refreshtoken)
router.post('/login',userCtrl.login)
router.get('/logout',userCtrl.logout)
router.get('/info',auth,userCtrl.getUser)

GIT 

module.exports = router;