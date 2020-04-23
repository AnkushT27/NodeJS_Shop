const mongodb = require('mongodb');
const Product = require('../models/product');


const addProduct = (req,res,next)=>{
    const prod = new Product(req.body.title,req.body.price,req.body.url,req.body.description,null,req.user.id);
    prod.save().this((product)=>{
        console.log('product',product)
    }).catch((err)=>{
        console.log('product',err)
    })
}

const addProductForm = (req,res,next)=>{
   res.render('admin/edit-product.ejs',{pagetitle:"HB Product",path:'/admin/add-product', edit:false})
}

const adminProductList = (req,res,next)=>{
   Product.fetchAll().then((products)=>{
        res.render('admin/list-product.ejs',{products:products,
            pagetitle:"Admin Product List",path:'/admin/add-product'})
    }).
    catch((err)=>{
        console.log(err);
    })
}

const editProductForm = (req,res,next)=>{
    let id = req.query.productid;
    let editMode = req.query.edit;
    Product.fetchByID(id).then(
        (product)=>{
            res.render('admin/edit-product.ejs',{
            pagetitle:"Admin Product List",
            path:'/admin/add-product',
            edit:editMode,
            product:product
            })
        })
    .catch((err)=>{
        console.log(err);
    })
}

const editProduct = (req,res,next)=>{
 new Product(req.body.title,req.body.price,req.body.url,req.body.desc,mongodb.ObjectId(req.body.id)).save()
  .then((updatdProduct)=>{
    res.redirect('/admin/product');
  })
  .catch((err)=>{
      console.log(err)
  })
 
 
}
const deleteProduct = (req,res,next)=>{
    const deleteID = req.query.productid;
  Product.delete(deleteID).then(()=>{
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