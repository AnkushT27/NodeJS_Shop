const adminData = require('../controllers/admin');
const Products = require('../models/product');
const User = require('../models/user');
exports.productList = (req,res,next)=>{
   
Products.fetchAll().then(
   (products)=>{
      res.render('shop/product-list.ejs',{products:products,path:'/',hasProducts:products.length>0,pagetitle:'My Shop'});
   }).catch((err)=>{
      console.log(err);
   });
 }

exports.products = (req,res,next)=>{
  res.render('shop/index.ejs',{pagetitle:'Products'});
}

exports.deleteFromCart = (req,res,nex)=>{
   console.log('this is called')
     let productId = req.body.productId;
     req.user.deleteCart(productId).
     then((deleteStatus)=>{
        console.log(deleteStatus)
         res.redirect('/cart');
     }).
     catch((err)=>{
      console.log(err)
     })
    
}

exports.cart = (req,res,next)=>{
   let productId = req.body.productid;
   let user = req.user;
   console.log('my product id',productId);
   Products.fetchByID(productId).then((product)=>{
   console.log('product id',product);
   req.user.saveToCart(product,user).then((response)=>{
         console.log('response',response)
         res.redirect('/cart');
   }).catch((err)=>{
      console.log('err',err);
   })
})
}

exports.cartList = (req,res,next)=>{
      req.user.fetchCart().then((cartdata)=>{
         console.log('cartdata',cartdata)
         res.render('shop/cart.ejs',{pagetitle:"Cart",cartArray:cartdata});
      }).catch((err)=>{
         console.log('err',err)
      })
 }


exports.orders = (req,res,next)=>{
   //fetch the associated tables
   req.user.getOrders().then((order)=>{
      res.render('shop/orders.ejs',{pagetitle:"Orders",orderArray:order});
   }).catch((err)=>{
      console.log('error',err)
   })
}

exports.checkout = (req,res,next)=>{
  req.user.checkout().
  then((response)=>{
     console.log('response',response)
     res.redirect('/orders')
  })
  .catch((err)=>{
   console.log('err',err)
  })
}

exports.productDetails = (req,res,next)=>{
  let id = req.params.productId;
 Products.fetchByID(id).then(
     (product)=>{
        console.log('product fetched',product)
        res.render('shop/product-detail.ejs',{pagetitle:"Details",product:product});
     }
 ).catch()
  
}

