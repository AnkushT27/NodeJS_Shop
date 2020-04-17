
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const handlebar = require('express-handlebars');
const notFoundController = require('./controllers/404');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/Cart');
const CartItem = require('./models/Cart-Item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const sequelize = require('./util/db');
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
    User.findByPk(1).then((res)=>{
     //this is the sequelize user object with all its associations
        req.user = res;
        next();
    }).
    catch(err=>{
        console.log(err)
    })
   
});

app.use('/admin',adminRoute.adminRouter); //route filter /admin/.. added
app.use(shopRoute);
//syncs my models to my DB
Product.belongsTo(User,{})
User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);
Order.belongsTo(User,{});
Cart.belongsTo(User);
//Many 2 Many Relationship
Cart.belongsToMany(Product,{ through : CartItem});
Product.belongsToMany(Cart,{ through: CartItem});
Order.belongsToMany(Product,{ through : OrderItem});
Product.belongsToMany(Order,{ through: OrderItem});

//syncing and adding a dummy user
sequelize
.sync()
// .sync({force:true})
.then((res)=>{
   
    User.findByPk(1)
    .then((user)=>{
        if(user){
           
        }
        else{
            User.create({
                name:'test',
                email:'test@gmail.com'
            }).then((res)=>{
                res.createCart(res=>{
                    
                    return res
                })
             .catch((err)=>{
                console.log('error',err);
            })
        }).catch(err=>{
           console.log(err);
        })
    }
})
    .catch((err)=>{
        console.log('err',err);
    })
    app.use(notFoundController.NotFoundConroller)
    app.listen(3000);  

});
        
