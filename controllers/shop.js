const adminData = require('../controllers/admin');
const Products = require('../models/product');
const Orders = require('../models/order');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');
const ITEMS_PAGE = 3;
const stripe = require('stripe')('sk_test_zK7aWuCqgEVIrdLO6AeUM2YU00vh1PVIFZ');
exports.productList = (req,res,next)=>{
const page = req.query.page || 1;
 Products.countDocuments().then((count)=>{
   return Products.find().skip((page-1)*ITEMS_PAGE).limit(ITEMS_PAGE)
   .then(
      (products)=>{
         res.render('shop/product-list.ejs',
         {products:products,path:'/',
         hasProducts:products.length>0,
         pagetitle:'My Shop',
         count:count,
         perPage:ITEMS_PAGE,
         currentPage:page,
         limit:Math.ceil(count/ITEMS_PAGE)
      });
      }).catch((err)=>{
         console.log(err);
      });
})
.catch((err)=>{
   console.log('err',err);
})

 }

exports.products = (req,res,next)=>{
  res.render('shop/index.ejs',{pagetitle:'Products'});
}

exports.goToCheckout = (req,res,next)=>{
   req.user.populate('cart.products.productID')
   .execPopulate()
   .then((user)=>{
      console.log('user--->',user.cart.products);
      let totalPrice = 0;
      user.cart.products.forEach((product)=>{
         totalPrice += product.quantity * product.productID.price;
      });
      return stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:user.cart.products.map((p)=>{
               return {
                  name:p.productID.title,
                  description:p.productID.description,
                  amount:p.productID.price,
                  currency:'inr',
                  quantity:p.quantity
               }
            }),
            success_url: req.protocol + '://' + req.get('host') + '/checkout/succcess',
            cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      })
      .then((session)=>{
         res.render('shop/checkout.ejs',
      {pagetitle:"Cart",
      cartArray:user.cart.products,
      totalPrice:totalPrice,
      sessionId:session.id
   });
      }).catch((err)=>{
         console.log('err',err);
      })

      
   })
   .catch((err)=>{
      console.log('err',err);
   })  
 }


exports.getInvoice = (req,res,next)=>{
  let orderId = req.params.orderid;
  //reading stream of a file
  Orders.findById(orderId).then((order)=>{
     if(!order){
      console.log('1st half');
     }
     if(order.user.userId.toString() != req.user._id.toString()){
      console.log('2nd half');
     }
     else{
      console.log('orderid',orderId)
      const filePath = path.join('data','invoice',orderId+'_invoice.pdf')
      const pdf = new pdfDocument();
      res.setHeader('Content-Type','application/pdf');
      res.setHeader('Content-Disposition','attatchment;filename="'+orderId+"_invoice.pdf"+'"');
      pdf.pipe(fs.createWriteStream(filePath));
      pdf.pipe(res);
      pdf.text('Invoice',{
         underline:true,
          height:21
      })
      let totalPrice = 0;
      order.products.forEach((product)=>{
         totalPrice += parseInt(product.productData.price) * parseInt(product.quantity)
         pdf.text(product.productData.title+'--'+product.productData.price+'*'+product.quantity);
      });
      pdf.text(totalPrice); 
      pdf.end()
      }
  })
  .catch((err)=>{
   console.log('err',err);
  })
  
  //pipe it to the stream
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
      res.render('shop/cart.ejs',{pagetitle:"Cart",cartArray:user.cart.products});
   })
   .catch((err)=>{
      console.log('err',err);
   })  
}


exports.orders = (req,res,next)=>{
   Orders.find({'user.userId':req.user._id}).then((orders)=>{
      console.log('orders',orders.products)
      res.render('shop/orders.ejs',{pagetitle:"Order",orderArray:orders});
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
        res.render('shop/product-detail.ejs',{pagetitle:"Details",product:product});
     }
 ).catch()
  
}

