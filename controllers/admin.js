const Product = require('../models/product');


const addProduct = (req,res,next)=>{
    req.user.createProduct(
        {
            title:req.body.title,
            price:req.body.price,
            url:req.body.url,
            description:req.body.desc
        }
    ).then(
        (result)=>{
            console.log(result)
            res.redirect('/')
        }
    ).catch(
        (err)=>{
            console.log(err); 
        }
    )
   
}

const addProductForm = (req,res,next)=>{
   res.render('admin/edit-product.ejs',{pagetitle:"HB Product",path:'/admin/add-product', edit:false})
}

const adminProductList = (req,res,next)=>{
    req.user.getProducts().then((products)=>{
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
    req.user.getProducts({where:{id:id}}).then(
        ([product])=>{
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
  Product.update({
      title:req.body.title,
      price:req.body.price,
      url:req.body.url,
      description:req.body.desc
  },{where:{id:req.body.id}})
  .then(()=>{
    res.redirect('/admin/product');
  })
  .catch((err)=>{
      console.log(err)
  })
 
 
}
const deleteProduct = (req,res,next)=>{
    const deleteID = req.query.productid;
   Product.destroy({where:{id:deleteID}}).then(()=>{
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