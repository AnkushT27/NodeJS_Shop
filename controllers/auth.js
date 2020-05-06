const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

//Initializing our mail transporter

const transporter = nodemailer.createTransport(sendgrid({
  auth:{
    api_key:'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'
  }
}))

exports.getLogin = (req, res, next) => {
  
    res.render('auth/login.ejs', {
      path: '/login',
      pagetitle: 'Login',
     error:req.flash('error')
    });
  };

exports.forgetPassword = (req, res, next) => {
  
    res.render('auth/forget-password.ejs', {
      path: '/forget',
      pagetitle: 'Forget',
      error:req.flash('error')
    });
  };

  exports.postForgetPassword = (req, res, next) => {
    let email = req.body.email;
    console.log('email',email);
    //creating the token for link authoization
     crypto.randomBytes(32,(err,buffer)=>{
         if(err){
            res.redirect('/login');
         }
         else{
           const token = buffer.toString('hex');
             User.findOne({email:email}).
           then((user)=>{
             console.log('myuser-->',user)
              user.resetToken = token;
              user.resetTokenTime = Date.now() + 36000000;
              user.save()
              .then((addeduser)=>{
                if(addeduser){
                
                  transporter.sendMail({
                    to:email,
                    from:'ankushtiwari102@gmail.com',
                    subject:'reset password link',
                    html:`
                    <h1>Email reset Link</h1>
                    <a href="http://localhost:3600/reset-password/${token}">Click here!!</a>
                    `
                  })
                  res.redirect('/login');
 
                }
            })
            .catch((err)=>{
               console.log('err',err)
            })
           })
           .catch((err)=>{
            console.log(err);
           })
           
         }
     })
    
  };

  exports.getSignup = (req, res, next) => {
    res.render('auth/signup.ejs', {
      path: '/signup',
      pagetitle: 'Signup',
      
      error:req.flash('error')
    });
  };

  exports.postResetPassword= (req, res, next) => {
    let userId = req.body.userId;
    let token = req.body.token;
    let password = req.body.password
     User.findOne({_id:userId,
      resetToken:token,
      resetTokenTime:{$gt:Date.now()}}
      ).then((user)=>{
          return bcrypt.hash(password,12)
          .then((hashedpassword)=>{
            user.password = hashedpassword;
            user.resetTokenTime = undefined;
            user.resetToken = undefined;
            return user.save()
          })
          .then((addeduser)=>{
            if(addeduser){
               res.redirect('/login');
            }
          })
          .catch((err)=>{
            console.log('err',err)
          })
      })
      .catch((err)=>{
        console.log('err',err);
      })

  }



  exports.resetPassword = (req, res, next) => {
    let token = req.params.token;
    User.findOne({resetToken:token})
    .then((user)=>{
        if(user){
          res.render('auth/reset-password.ejs', {
            path: '/reset',
            pagetitle: 'reset',
            token:user.resetToken,
            userId:user._id,
           error:req.flash('error')
          });
        }
    })
    .catch((err)=>{
        console.log('err',err);
    })
    
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