const mongodb = require('mongodb');
const Product = require('../models/product');


const addProduct = (req,res,next)=>{
    
    let prod = new Product(
        {
        title:req.body.title,
        price:req.body.price,
        url:req.body.url,
        description:req.body.desc,
        userId:req.session.user
        }
    );
    
    prod.save((product)=>{
        console.log('product',product)
        res.redirect('/product');
    });
}

const addProductForm = (req,res,next)=>{
   res.render('admin/edit-product.ejs',{pagetitle:"HB Product",path:'/admin/add-product', edit:false,isAuth: req.session.isLoggedin})
}

const adminProductList = (req,res,next)=>{
   Product.find({userId:req.user._id}).then((products)=>{
        res.render('admin/list-product.ejs',{products:products,
            pagetitle:"Admin Product List",path:'/admin/add-product',isAuth: req.session.isLoggedin})
    }).
    catch((err)=>{
        console.log(err);
    })
}

const editProductForm = (req,res,next)=>{
    let id = req.query.productid;
    let editMode = req.query.edit;
    Product.findById(id).then(
        (product)=>{
            res.render('admin/edit-product.ejs',{
            pagetitle:"Admin Product List",
            path:'/admin/add-product',
            edit:editMode,
            product:product
            ,isAuth: req.session.isLoggedin
            })
        })
    .catch((err)=>{
        console.log(err);
    })
}

const editProduct = (req,res,next)=>{
    let id = req.body.id;
    Product.findById(id).then(
        (product)=>{
            if(product.userId.toString() == req.user._id.toString())
          { product.title = req.body.title;
            product.price = req.body.price;
            product.url = req.body.url;
            product.description = req.body.desc;
           return product.save()
          }
          else{
              res.redirect('/admin/product');
          }
        })
        .then(()=>{
            res.redirect('/admin/product');
          })
          .catch((err)=>{
              console.log(err)
          })
        .catch((err)=>{
            console.log(err)
        })
 
 
 
}
const deleteProduct = (req,res,next)=>{
    const deleteID = req.query.productid;
  Product.deleteOne({_id:deleteID,userId:req.user._id}).then((deleted)=>{
    res.redirect('/admin/product');
   })
    .catch((err)=>{
        console.log(err);
    })
}

module.exports = {
    addProductController:addProduct,
    addProductFormController:addProductForm,
    adminProductList:adminProductList,
    editProductForm:editProductForm,
    editProduct:editProduct,
    deleteProduct:deleteProduct
}