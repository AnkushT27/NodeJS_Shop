const productsArray = [];
const path = require('path');
const rootdir = require('../util/path')
const fs = require('fs');
const p = path.join(rootdir,'data','products.json');
const readContentsFromFile = cb =>{
    let products = []
    fs.readFile(p,(err,data)=>{
        console.log('err',err,'data',data)
        if(!err){
            products= JSON.parse(data);
            //my callback function
             cb(products);
        }
        else{
        cb([]);
        }
    })
}

module.exports = class Products{
    constructor(id,title,price,url,desc){
        this.id = id;
        this.title = title;
        this.price = price;
        this.url = url;
        this.desc = desc;
    }

    save()
    {
     readContentsFromFile((products)=>{
         console.log('my id',this.id)
        if(this.id){
          let productIndex = products.findIndex((val)=>{ return val.id == this.id})
          let updatedProductsArray = [...products];
          updatedProductsArray[productIndex] = this;
          console.log('updatedProductsArray',updatedProductsArray)
          fs.writeFile(p,JSON.stringify(updatedProductsArray),(err)=>{
            console.log(err);
        })
        }
        else{
        this.id = Math.random().toPrecision(1).toString();
        products.push(this);
        fs.writeFile(p,JSON.stringify(products),(err)=>{
            console.log(err);
        })
     }

    })
  } 

    static fetchAll(cb){
       readContentsFromFile(cb)
    }

    static fetchById(id,cb){
      
       readContentsFromFile((data)=>{
            var product = data.find((val)=>{
                return val.id == id 
                
            });
          cb(product);
      })
     
    }

    static delete(id){
      
        readContentsFromFile((data)=>{
             let productIndex = data.findIndex((val)=>{
                 return val.id == id;
               });
               data.splice(productIndex,1);
               fs.writeFile(p,JSON.stringify(data),(err)=>{
                   console.log(err);
               })
        })
      
     }
}