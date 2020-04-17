const adminData = require('../controllers/admin');
const Products = require('../models/product');

exports.productList = (req,res,next)=>{
   
Products.findAll().then(
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
     let productId = req.body.productId;
     req.user.getCart().then((cart)=>{
        return cart.getProducts({where:{id:productId}})
     })
     .then(([product])=>{
       return product.cartitem.destroy();
     })
     .then((response)=>{
        res.redirect('/cart');
     })
     .catch((err)=>{})
    
}

exports.cart = (req,res,next)=>{
   let id = req.body.productid;
   req.user.getCart().then((cart)=>{
         cart.getProducts({where:{id:id}}).then(([product])=>{
            if(product){
               cart.addProduct(product,{through : {quantity:product.cartitem.quantity+1}}
                 
                  ).then((updateProduct)=>{
                     res.redirect('/cart');
                  }).catch((err)=>{
                     console.log(err)
                  })
            }
            else{
               let newProductQuantity = 1
               //adding the extra quantity field
               Products.findByPk(id).then((product)=>{
               console.log('product',product)
               //many to many gives add
               cart.addProduct(product,{through : {quantity:newProductQuantity}}).then(
                  (addedProduct)=>{
                      res.redirect('/cart');
                        
                  }).catch((err)=>{
                     console.log('my error',err)
                  })
               }).catch(err=>{
                  console.log('my error',err)
               })
            }
         }).catch((err)=>{

         })
   }).catch((err)=>{

   })
}

exports.cartList = (req,res,next)=>{
  
  req.user.getCart()
  .then((cart)=>{
      cart.getProducts().then(
         (products)=>{
           if(products.length > 0){
          console.log(products[0])
            res.render('shop/cart.ejs',{pagetitle:'My Cart',cartArray:products});
           }
           else{
            res.render('shop/cart.ejs',{pagetitle:'My Cart',cartArray:[]})
           }
         }).catch(
            (err)=>{
               console.log(err)
         })   
  })
  .catch((err)=>{
   console.log(err)
  })
    
 }


exports.orders = (req,res,next)=>{
   //fetch the associated tables
   req.user.getOrders({include:['products']}).then((order)=>{
      res.render('shop/orders.ejs',{pagetitle:"Orders",orderArray:order});
   }).catch((err)=>{
      console.log('error',err)
   })
}

exports.checkout = (req,res,next)=>{
   let productsArray
   let fetchedCart
   req.user.getCart().then((cart)=>{
      fetchedCart= cart;
    return cart.getProducts()
   })
   .then((products)=>{
      productsArray = products;
      return req.user.createOrder();
   })
   .then((order)=>{
      return order.addProducts(productsArray.map((product)=>{
         product.orderitem = {quantity:product.cartitem.quantity}

         return product;
      })
     ).catch((err)=>{
        console.log('error',err)
     })
   })
   .then((result)=>{
      fetchedCart.setProducts(null);
      res.redirect('/orders');
   })
  
   
}

exports.productDetails = (req,res,next)=>{
  let id = req.params.productId;
 Products.findAll({where:{id:id}}).then(
     ([product])=>{
        res.render('shop/product-detail.ejs',{pagetitle:"Details",product:product});
     }
 ).catch()
  
}

