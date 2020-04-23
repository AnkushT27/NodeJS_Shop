
const mongodb = require('mongodb');
const db = require('../util/db').getdb


module.exports = class User {
    constructor(name,email,cart,id){
            this.name = name;
            this.email = email;
            this.cart = cart;
            this.id = id;
    }

    save(){
     
    }

    saveToCart(product,user){
        let dbs = db();
        let updatedUser = user;
        let exsistingProdId =user.cart.findIndex((value)=>{ 
                if(value){
                console.log(value.product.toString(),product._id.toString());
             return value.product.toString() == product._id.toString();
        }
        })
        console.log('exsistingProdId',exsistingProdId)
        if(exsistingProdId>=0){
                console.log('in if',exsistingProdId)
           let updatedExsistingProduct = {...updatedUser.cart[exsistingProdId],quantity:updatedUser.cart[exsistingProdId].quantity+1}
           updatedUser.cart[exsistingProdId] = updatedExsistingProduct;
           return dbs.collection('users').updateOne({_id:mongodb.ObjectID(user.id)},{$set:{cart:updatedUser.cart}}).
           then((updatecount)=>{
                   return updatecount
           }).
           catch((err)=>{
                   console.log('error',err);
           })
        }
        else{
               
        updatedUser.cart.push({product:product._id,quantity:1});
        return dbs.collection('users').updateOne({_id:mongodb.ObjectID(user.id)},{$set:updatedUser}).
        then((updatecount)=>{
                return updatecount
        }).
        catch((err)=>{
                console.log('error',err);
        })
      }
     }

    static findById(id){
        let dbs = db();
       return dbs.collection('users').findOne({_id:mongodb.ObjectID(id)}).
        then((user)=>{
                console.log(user);
                return user;
        }).
        catch((err)=>{
        console.log(user);
        })
    }

    deleteCart(productId){
        let dbs = db();
        let deleteIndex =this.cart.findIndex((value)=>{
                console.log('----->',value.product.toString(),productId.toString())
                return value.product.toString() === productId.toString();
        })
        console.log('cart',this.cart,deleteIndex)
        this.cart.splice(deleteIndex,1);
        console.log('cart',this.cart);
       return dbs.collection('users').updateOne({_id:this.id},{$set:{cart:this.cart}})
       .then((response)=>{
             return response;
       })
        .catch((err)=>{
                return err;
        })
    }


    getOrders(){
        let dbs= db();
        return dbs.collection('orders').find({'user._id':this._id}).toArray().then((orders)=>{
                return orders;
        }).catch((err)=>{
                console.log('err',err)
        })
    }

    checkout(){
        let dbs = db();
        return this.fetchCart().then((products)=>{
                let order = {
                        productData:products,
                        user:{
                          id:this.id,
                          name:this.name,
                          email:this.email
                        }
                }
       return dbs.collection('orders').insertOne(order).then((response)=>{
               return dbs.collection('users').
               updateOne({_id:this.id},{$set:{cart:[]}}).then((updateStatus)=>{
                return updateStatus
               })
               .catch((err)=>{
                   console.log('err',err)
               })
         }).
        catch((err)=>{
                console.log(err)
        })
        }).catch((err)=>{

        })
    }


    fetchCart(){
            let dbs = db();
            let productIds = this.cart.map((productData)=>{
                    return productData.product
            });
            console.log('productIds',productIds)
            return dbs.collection('product')
            .find({ _id:{$in:productIds}})
            .toArray()
            .then((cartdata)=>{
                    console.log('cartdata---->',cartdata)
               return cartdata.map((cartproducts)=>{
                         return {...cartproducts,quantity: this.cart.find((cart)=>{
                              return cart.product.toString() == cartproducts._id.toString()
                         }).quantity
                        }   
                    })
            })
            .catch((err)=>{console.log(err)})
    }
    
    }
    

    


