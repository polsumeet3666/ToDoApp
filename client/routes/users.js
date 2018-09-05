var express = require('express');
var router = express.Router();
var userService = require('../service/userService');
var noteService = require('../service/noteService');

// auth function redirect to login page if no session found
function auth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  }
  else {
    res.redirect('/');
  }
};

/* GET users listing. */
router.get('/', (req, res, next) =>{
  res.send('respond with a resource');
});

// create new user
router.post('/create', (req, res, next) => {
  
  var context = {
    title: 'To-Do App'
  }

  userService.createUser(req.body)
    .then((result) => {
      context.userCreatedSuccess = true;
      res.render("index", context);
    })
    .catch((error) => {
      context.userCreatedFail = true;

      res.render("signup", context);
    })
});

router.post('/login', (req, res, next) => {
  
  
  var context = {
    title: 'To-Do App'
  }
  userService.userLogin(req.body)
    .then((result) => {
      context.user = result;
      req.session.user = context.user;
      res.redirect('/users/dashboard');
    })
    .catch((err) => {
      context.loginfailed = true;
      res.render("index", context);
    })
});

router.get('/note/create',auth, (req, res, next) => {
  var context = {};
  context.title = 'Create Note';
  res.render("noteCreate", context);
});


router.post('/note/save',auth, (req, res, next) => {

  var note = req.body;
  note.owner = req.session.user.email;
  note.createdOn = new Date();
  var context = {
    title: 'To-Do App'
  };

  noteService.saveNote(note)
    .then((result) => {
      //res.render('dashboard',context);
      res.redirect('/users/dashboard');
    })
    .catch((error) => {
      res.render('noteCreate', context);
    });
});

router.get('/dashboard', auth, (req, res, next) => {
  var context = {
    title: 'To-Do App'
  }
  noteService.fetchNotes(req.session.user.email)
    .then((result) => {
      
      context.notes = result;
      context.user = req.session.user;
      res.render('dashboard', context);
    })
    .catch((err) => {
      console.log('fetchNotes error' + err);
    });

});

router.get('/note/edit/:id',auth,(req,res,next)=>{
  
  var context = {
    title: 'To-Do App | Edit'
  }
  noteService.fetchNote(req.params.id)
    .then((result)=>{

      context.note = result;
      res.render('noteCreate',context);

    })
    .catch((err)=>{
      console.log('fetchnote error :: '+err);
    })

});

router.get('/note/delete/:id',(req,res,next)=>{
  
  noteService.deleteNote(req.params.id)
    .then((result)=>{
      res.redirect('/users/dashboard');
    })
    .catch((err)=>{
      console.log('deletenote error ::'+ err);
    });
});

module.exports = router;
