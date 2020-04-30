const adminData = require('../controllers/admin');
const Products = require('../models/product');
const Orders = require('../models/order');
const User = require('../models/user');
exports.productList = (req,res,next)=>{
   
Products.find().then(
   (products)=>{
      res.render('shop/product-list.ejs',{products:products,path:'/',hasProducts:products.length>0,pagetitle:'My Shop',isAuth: req.session.isLoggedin});
   }).catch((err)=>{
      console.log(err);
   });
 }

exports.products = (req,res,next)=>{
  res.render('shop/index.ejs',{pagetitle:'Products',isAuth: req.session.isLoggedin});
}

exports.deleteFromCart = (req,res,nex)=>{
   console.log('this is called')
   req.user.deleteFromCart(req.body.productId).
   then((deleted)=>{
      res.redirect('/cart');
   }).
   catch((err)=>{
      console.log('err',err);
   })
    
}

exports.cart = (req,res,next)=>{
   let productId = req.body.productid;
    Products.findById(productId).then((product)=>{
       console.log('req.session.user',req.session.user)
req.user.addToCart(product).then((response)=>{
         console.log('response',response)
         res.redirect('/cart');
       }).catch((err)=>{
      console.log('err',err);
     })
})
}

exports.cartList = (req,res,next)=>{
   req.user.populate('cart.products.productID')
   .execPopulate()
   .then((user)=>{
      console.log('user--->',user.cart.products);
      res.render('shop/cart.ejs',{pagetitle:"Cart",cartArray:user.cart.products,isAuth: req.session.isLoggedin});
   })
   .catch((err)=>{
      console.log('err',err);
   })  
}


exports.orders = (req,res,next)=>{
   Orders.find({'user.userId':req.user._id}).then((orders)=>{
      console.log('orders',orders.products)
      res.render('shop/orders.ejs',{pagetitle:"Order",orderArray:orders,isAuth: req.session.isLoggedin});
   })
}

exports.checkout = (req,res,next)=>{
   req.user.populate('cart.products.productID')
   .execPopulate()
   .then((user)=>{
     const products = user.cart.products.map((value)=>{
         return {productData:
            {_id:value.productID._id,
            title:value.productID.title,
               price:value.productID.price,
               url:value.productID.url,
               description:value.productID.description
            },
            quantity:value.quantity}
      })
      console.log('product info',products)
      const order = new Orders({
         user:{username:req.user.name,
         userId:req.user
         },
         products:products
        })
       order.save().then((saved)=>{
         req.user.cart.products = []
         req.user.save().then((saved)=>{
            res.redirect('/orders');
         }).catch((err)=>{
            console.log(err);
         })
        
       }).catch((err)=>{
         console.log('err',err)
       })
     
   }).
   catch((err)=>{
      console.log('err',err)
   })

  
}

exports.productDetails = (req,res,next)=>{
  let id = req.params.productId;
 Products.findById(id).then(
     (product)=>{
        console.log('product fetched',product)
        res.render('shop/product-detail.ejs',{pagetitle:"Details",product:product,isAuth: req.session.isLoggedin});
     }
 ).catch()
  
}

