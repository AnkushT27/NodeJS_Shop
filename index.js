const adminRoute = require('./routes/admin');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const shopRoute = require('./routes/shop');
const User = require('./models/user');
const db = require('./util/db').mongoConnection;
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
  User.findById('5e9fc7d04950832b0c3db6a2').then((response)=>{
    console.log(response);
    req.user = new User(response.name,response.email,response.cart,response._id)
    next();
  }).catch(err=>{
    console.log(err);
  }) 
});

app.use('/admin',adminRoute.adminRouter); //route filter /admin/.. added
app.use(shopRoute);
//syncs my models to my DB

  //app.use(notFoundController.NotFoundConroller)


db(response=>{
  console.log(response)
  app.listen(3000);  
})



  


        
