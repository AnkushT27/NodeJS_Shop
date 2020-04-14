const path = require('path');
const fs = require('fs');
const rootDir = require('../util/path')
const p = path.join(rootDir,
'data',
'shop.json' 
)

const readCartContents = (cb) => {
    fs.readFile(p,(err,data)=>{
        if(!err){
            cb(JSON.parse(data))
        }
    })
}

module.exports = class Shop{
    constructor(products,totalprice){
         this.products = products
         this.totalprice = totalprice
    }

    static addProductCart(id,productPrice){
        let exsistingProducts;
        let shop;
        readCartContents((data)=>{
        //using ES6 Spread operators
         exsistingProducts = {...data};
         let productpresentIndex = exsistingProducts.products.findIndex((val)=>val.id == id);
        if(productpresentIndex!=-1){
          exsistingProducts.products[productpresentIndex].qty = exsistingProducts.products[productpresentIndex].qty+1;
          exsistingProducts.totalprice=exsistingProducts.totalprice+  +productPrice;
          shop = {...exsistingProducts};
         }
         else{
             shop = {...exsistingProducts}
             shop.products.push({id:id,qty:1});
             shop.totalprice= shop.totalprice+ +productPrice;
         }
         fs.writeFile(p,JSON.stringify(shop),(err)=>{
             console.log(err);
         })

        })

    }

    static fetchAll(cb){
        readCartContents(cb);
    }

    static delete(id,price){
        let index;
        readCartContents((data)=>{
            console.log('my cart data',data);
            index = data.products.findIndex((val)=> {
               return val.id == id
              });
            data.totalprice = data.totalprice - price*data.products[index].qty;
            data.products.splice(index,1);
            fs.writeFile(p,JSON.stringify(data),(err)=>{
                console.log(err);
            })
        })

    }
}