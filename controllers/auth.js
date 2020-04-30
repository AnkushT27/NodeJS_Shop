const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login.ejs', {
      path: '/login',
      pagetitle: 'Login',
      isAuth:req.session.isLoggedin
    });
  };

  exports.postLogin = (req, res, next) => {
    
    
    User.findById('5ea44333aa857628d4b66ae7').then((fetchedUser)=>{
      if(fetchedUser!=undefined){
        console.log('fetchedUser',fetchedUser)
        req.session.isLoggedin = true;
       req.session.user = fetchedUser;
       res.redirect('/');
       }
      else{
      const user = new User({
          name:'test',
          email:'ankushtiwai102@gmail.com',
          cart:{
            products:[]
          }
        })
        user.save().then((saved)=>{
          req.session.user = user;
          req.session.isLoggedin = true;
          res.redirect('/');
          
       })
        .catch(err=>{
          console.log('my error',err);
        })
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