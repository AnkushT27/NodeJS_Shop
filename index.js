
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dbpool = require('./util/db');
const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const handlebar = require('express-handlebars');
const notFoundController = require('./controllers/404')
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
app.use('/admin',adminRoute.adminRouter); //route filter /admin/.. added
app.use(shopRoute);

app.use(notFoundController.NotFoundConroller)

app.listen(3000);