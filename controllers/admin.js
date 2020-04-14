const Product = require('../models/product');

const addProduct = (req,res,next)=>{
    const p = new Product(null,req.body.title,req.body.price,req.body.url,req.body.desc);
    p.save();
    res.redirect('/')
}

const addProductForm = (req,res,next)=>{
   res.render('admin/edit-product.ejs',{pagetitle:"HB Product",path:'/admin/add-product', edit:false})
}

const adminProductList = (req,res,next)=>{
   Product.fetchAll((products)=>{
        res.render('admin/list-product.ejs',{products:products,
            pagetitle:"Admin Product List",path:'/admin/add-product'})
    })
}

const editProductForm = (req,res,next)=>{
    let id = req.query.productid;
    let editMode = req.query.edit;
    Product.fetchById(id,(product)=>{
    res.render('admin/edit-product.ejs',{
    pagetitle:"Admin Product List",
    path:'/admin/add-product',
    edit:editMode,
    product:product
    })
});
}

const editProduct = (req,res,next)=>{
  const product = new Product(req.body.id,req.body.title,req.body.price,req.body.url,req.body.desc);
  product.save();
 res.redirect('/admin/product');
}
const deleteProduct = (req,res,next)=>{
    const deleteID = req.query.productid;
    Product.delete(deleteID);
    res.redirect('/admin/product');
}

module.exports = {
    addProductController:addProduct,
    addProductFormController:addProductForm,
    adminProductList:adminProductList,
    editProductForm:editProductForm,
    editProduct:editProduct,
    deleteProduct:deleteProduct
}