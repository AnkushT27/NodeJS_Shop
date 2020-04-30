const adminRoute = require('./routes/admin');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const shopRoute = require('./routes/shop');
const User = require('./models/user');
// const db = require('./util/db').mongoConnection;
const mongoose = require('mongoose');
const Store = require('connect-mongodb-session')(session);
const authroute = require('./routes/auth')
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
const store = new Store({
  uri:'mongodb+srv://Ankush-27:test@cluster0-cqcvw.mongodb.net/shop?retryWrites=true&w=majority',
  collection:'session'
})
app.use(session({
   secret:'Ankush',
   resave:false,
   saveUninitialized:false,
   store:store
}))


//getting the context for the current user

  mongoose.connect('mongodb+srv://Ankush-27:test@cluster0-cqcvw.mongodb.net/shop?retryWrites=true&w=majority')
  .then((connected)=>{
    if(connected){
      console.log('connected',connected)
    }
  })
  .catch((err)=>{
    console.log('err',err);
  })


app.use((req,res,next)=>{
  if(req.session.user){
  User.findById(req.session.user._id)
  .then((user)=>{
    req.user = user;
    next();
  })
  .catch((err)=>{
    console.log(err);
  })
}
else{
  next();
} 
})

app.use('/admin',adminRoute.adminRouter); //route filter /admin/.. added
app.use(shopRoute);
app.use(authroute);
app.listen(3600);
//syncs my models to my DB

  //app.use(notFoundController.NotFoundConroller)

  
  


        
