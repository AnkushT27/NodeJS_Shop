const User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.getLogin = (req, res, next) => {
    res.render('auth/login.ejs', {
      path: '/login',
      pagetitle: 'Login',
      isAuth:req.session.isLoggedin,
      error:req.flash('error')
    });
  };

  exports.getSignup = (req, res, next) => {
    res.render('auth/signup.ejs', {
      path: '/signup',
      pagetitle: 'Signup',
      isAuth:req.session.isLoggedin,
      error:req.flash('error')
    });
  };

  exports.postSignup = (req, res, next) => {
     let email = req.body.email;
     let password = req.body.password;
     User.find({email:email}).then((userexsists)=>{
      
        if(userexsists.length > 0){
          req.flash('error','User exsists');
          res.redirect('/signup');
        }
        else{
          return bcrypt.hash(password,12)
          .then((hashedpassword)=>{
            const user = new User({
              name:'test',
              email:email,
              password:hashedpassword,
              cart:{
                products:[]
              }
            })
            return user.save();
           })
           .then((addeduser)=>{
              if(addeduser){
                  res.redirect('/login');
              }
           })
           .catch((err)=>{
             console.log(err)
           })
          .catch((err)=>{
            console.log(err)
          })
        }
     })
     .catch((err)=>{
        console.log('err',err);
     })
  };


  exports.postLogin = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    User.find({email:email}).then(([fetchedUser])=>{
      if(fetchedUser){
          bcrypt.compare(password,fetchedUser.password)
          .then((passwordMatch)=>{
            if(passwordMatch){
              req.session.isLoggedin = true;
              req.session.user = fetchedUser;
              res.redirect('/')
            }
            else{
              req.flash('error','Invalid Crendentials');
              res.redirect('/login')
            }
          })
       }
       else{
        req.flash('error','Invalid Crendentials');
        res.redirect('/login')
       }
     })
    
  };
  
  exports.postLogout = (req, res, next) => {
    req.session.destroy((err)=>{
      res.redirect('/');
    })
    // req.session.save().then(()=>{
    //   
    // })
  }