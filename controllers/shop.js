const adminData = require('../controllers/admin');
const Products = require('../models/product');
const Shop = require('../models/shop');
exports.productList = (req,res,next)=>{
   Products.fetchAll().then(
       ([rows,meta])=>{
        res.render('shop/product-list.ejs',{products:rows,path:'/',hasProducts:rows.length>0,pagetitle:'My Shop'});
       }
   ).catch();

}

exports.products = (req,res,next)=>{
  res.render('shop/index.ejs',{pagetitle:'Products'});
}

exports.deleteFromCart = (req,res,nex)=>{
     let productId = req.body.productId;
     Products.fetchById(productId,(product)=>{
        Shop.delete(productId,product.price);
        res.redirect('/cart');
     })
    
}

exports.cart = (req,res,next)=>{
   let id = req.body.productid;
   Products.fetchById(id,(product)=>{
   Shop.addProductCart(id,product.price);
    res.redirect('/product');
   })
}

exports.cartList = (req,res,next)=>{
  
   Shop.fetchAll((data)=>{
    const cartArray = [];
       const products = data.products;
         if(products.length > 0){
         products.forEach((val)=>{
           Products.fetchById(val.id,(product)=>{
               cartArray.push({productName:product.title,qty:val.qty,id:product.id});
              if(cartArray.length == products.length){
               res.render('shop/cart.ejs',{pagetitle:'My Cart',cartArray:cartArray});
               }

          })
       });
    }
    else{
        res.render('shop/cart.ejs',{pagetitle:'My Cart',cartArray:[]});
    }
    });
    
 }


exports.orders = (req,res,next)=>{
    res.render('shop/orders.ejs',{pagetitle:'My Orders'});
}

exports.productDetails = (req,res,next)=>{
  let id = req.params.productId;
 Products.fetchById(id).then(
     ([[row],meta])=>{
        res.render('shop/product-detail.ejs',{pagetitle:"Details",product:row});
     }
 ).catch()
  
}

