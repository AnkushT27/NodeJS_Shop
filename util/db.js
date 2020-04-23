//contains db connection logic
const mongo = require('mongodb').MongoClient;

let _db;

 exports.mongoConnection = (cb) =>{
 
  mongo.connect('mongodb+srv://Ankush-27:test@cluster0-cqcvw.mongodb.net/shop?retryWrites=true&w=majority',{useNewUrlParser:true}).
  then((conn)=>{
      if(conn){
        console.log('conn',conn)
        //will connect to my db if not exsist will create the same
        _db = conn.db();
        cb(conn);
         
      }

  }).catch((err)=>{
    console.log(err);
    cb(err);
  })
}

exports.getdb = () =>{
  if(_db){
    return _db;
  }
  else{
    return 'NO db'
  }
}