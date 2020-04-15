const db  = require('../util/db');
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
     return db.execute('INSERT INTO PRODUCTS (title,price,url,description) VALUES (?,?,?,?)',[this.title,this.price,this.url,this.desc]);
    } 

    static fetchAll(){
       return db.execute('SELECT * FROM PRODUCTS');
    }

    static fetchById(id){
        return db.execute('SELECT * FROM PRODUCTS where PRODUCTS.ID = ?',[id]);
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