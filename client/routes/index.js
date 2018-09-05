var express = require('express');
var router = express.Router();

//auth
function auth(req,res,next){
  if (req.session && req.session.user){
     next();
  }
  else {
    res.redirect('/');
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'To-Do App' });
});


router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'User | Signup' });
});

router.get('/logout',auth,(req,res,next) =>{
  req.session.destroy();
  res.redirect('/');
});
module.exports = router;
