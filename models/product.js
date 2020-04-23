
const mongodb = require('mongodb');
const db = require('../util/db').getdb


module.exports = class Product {
    constructor(title,price,url,description,id,userid){
            this.title = title;
            this.price = price;
            this.url = url;
            this.description = description;
            this.id = id ? mongodb.ObjectID(id):null;
            this.userid = userid;
    }

    save(){
        let dbS = db()
        if(this.id){
           return dbS.collection("product").updateOne({_id:this.id},{$set:this}).then((updated)=>{
               console.log('updated',updated)
               return updated;
           }).catch((err)=>{
               console.log('my err',err)
           })
        }
        else{
        dbS.collection("product").insertOne(this).then((addedProduct)=>{
                    console.log('my res',addedProduct);
                }).catch((err)=>{
                    console.log('my err',err);
                })

            }
            }

    
    static fetchAll(){
        let dbS = db()
         return dbS.collection("product").find().toArray().then((products)=>{
            return products
          }).catch((err)=>{
              console.log(err)
          })
        }

    static fetchByID(id){
            let dbS = db();
           return dbS.collection("product").find({_id:mongodb.ObjectID(id)}).next().then((product)=>{
                return product
              }).catch((err)=>{
                  console.log(err)
              })
        }

    static delete(id){
        let dbS = db();
        return dbS.collection("product").deleteOne({_id:mongodb.ObjectID(id)}).then((deleted)=>{
            console.log(deleted);
            return deleted;
        }).catch((err)=>{
            console.log(err);
        })
    }
    
    }
    

    


