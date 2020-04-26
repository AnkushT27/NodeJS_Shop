const adminRoute = require('./routes/admin');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const shopRoute = require('./routes/shop');
const User = require('./models/user');
// const db = require('./util/db').mongoConnection;
const mongoose = require('mongoose');
//create the server
var app = express();

//configure templating engine
//app.engine('hb',handlebar())
// app.set('view-engine','pug');
// app.set('views','views')
app.set('view-engine','ejs');
app.set('views','views')
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({extended:true}))


//getting the context for the current user
app.use((req,res,next)=>{
  mongoose.connect('mongodb+srv://Ankush-27:test@cluster0-cqcvw.mongodb.net/shop?retryWrites=true&w=majority')
  .then((connected)=>{
    if(connected){
      User.findById('5ea44333aa857628d4b66ae7').then(( fetchedUser)=>{
        
        if(fetchedUser!=undefined){
         
          req.user = fetchedUser;
          next();
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
            req.user = user;
            next();
           
          })
          .catch(err=>{
            console.log('my error',err);
          })

        }
       
      })
      .catch((err)=>{

      })
       
    }
    
  
  })
  .catch((err)=>{
    console.log('err',err);
  })


});

app.use('/admin',adminRoute.adminRouter); //route filter /admin/.. added
app.use(shopRoute);
app.listen(3600);
//syncs my models to my DB

  //app.use(notFoundController.NotFoundConroller)

  
  


        
