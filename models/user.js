const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const user = new Schema({
        name:
        {
        type:String,
        required:true
        },
        email:{
        type:String,
        required:true  
        },
        resetToken:{
        type:String,
        required:false  
        },
        resetTokenTime:{
         type:Date,
         required:false  
        },
        password:{
        type:String,
        required:true  
        },
        cart:{
                products:[{
                        productID:{
                                type:Schema.Types.ObjectId,
                                ref:'Products',
                                required:true
                        },
                        quantity:{
                                type:Number,
                                required:true
                        }
                }]
                
        }
        
})

user.methods.addToCart = function(product){
       
        let exsistingProdId =this.cart.products.findIndex((value)=>{ 
                if(value){
               
             return value.productID.toString() == product._id.toString();
        }
        })
      
        if(exsistingProdId>=0){
          let updatedExsistingProduct = {...this.cart.products[exsistingProdId],quantity:this.cart.products[exsistingProdId].quantity+1,productID:this.cart.products[exsistingProdId].productID}
           this.cart.products[exsistingProdId] = updatedExsistingProduct;
           return this.save()
        }
        else{
               
        this.cart.products.push({productID:product._id,quantity:1});
        return this.save();
      }

}


user.methods.deleteFromCart = function(productID){
       let deleteIndex = this.cart.products.findIndex((value)=>{
               console.log('---->',value.productID.toString(),productID.toString())
               return value.productID.toString() == productID.toString();
        });
        console.log('deleteIndex--->',deleteIndex)
        this.cart.products.splice(deleteIndex,1);
        return this.save()
}
module.exports = mongoose.model('user',user);



//     static findById(id){
//         let dbs = db();
//        return dbs.collection('users').findOne({_id:mongodb.ObjectID(id)}).
//         then((user)=>{
//                 console.log(user);
//                 return user;
//         }).
//         catch((err)=>{
//         console.log(user);
//         })
//     }

//     deleteCart(productId){
//         let dbs = db();
//         let deleteIndex =this.cart.findIndex((value)=>{
//                 console.log('----->',value.product.toString(),productId.toString())
//                 return value.product.toString() === productId.toString();
//         })
//         console.log('cart',this.cart,deleteIndex)
//         this.cart.splice(deleteIndex,1);
//         console.log('cart',this.cart);
//        return dbs.collection('users').updateOne({_id:this.id},{$set:{cart:this.cart}})
//        .then((response)=>{
//              return response;
//        })
//         .catch((err)=>{
//                 return err;
//         })
//     }


//     getOrders(){
//         let dbs= db();
//         return dbs.collection('orders').find({'user._id':this._id}).toArray().then((orders)=>{
//                 return orders;
//         }).catch((err)=>{
//                 console.log('err',err)
//         })
//     }

//     checkout(){
//         let dbs = db();
//         return this.fetchCart().then((products)=>{
//                 let order = {
//                         productData:products,
//                         user:{
//                           id:this.id,
//                           name:this.name,
//                           email:this.email
//                         }
//                 }
//        return dbs.collection('orders').insertOne(order).then((response)=>{
//                return dbs.collection('users').
//                updateOne({_id:this.id},{$set:{cart:[]}}).then((updateStatus)=>{
//                 return updateStatus
//                })
//                .catch((err)=>{
//                    console.log('err',err)
//                })
//          }).
//         catch((err)=>{
//                 console.log(err)
//         })
//         }).catch((err)=>{

//         })
//     }


//     fetchCart(){
//             let dbs = db();
//             let productIds = this.cart.map((productData)=>{
//                     return productData.product
//             });
//             console.log('productIds',productIds)
//             return dbs.collection('product')
//             .find({ _id:{$in:productIds}})
//             .toArray()
//             .then((cartdata)=>{
//                     console.log('cartdata---->',cartdata)
//                return cartdata.map((cartproducts)=>{
//                          return {...cartproducts,quantity: this.cart.find((cart)=>{
//                               return cart.product.toString() == cartproducts._id.toString()
//                          }).quantity
//                         }   
//                     })
//             })
//             .catch((err)=>{console.log(err)})
//     }
    
//     }
    

    


