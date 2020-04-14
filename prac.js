
const express = require('express')
const router = require('./routes/pracroute');
const bodyparser = require('body-parser');
const path = require('path')
const pracroute = require('./routes/pracroute');
//create the server
var app = express();

//configuring the template engine
app.set('view-engine','ejs')
app.set('views','views');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/practice',pracroute);
app.listen(3000);