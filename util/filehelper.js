const fs = require('fs');
const paths = require('path');


exports.deleteFile = (path)=>{
    const filePath = paths.join(__dirname,'../',path)
    fs.unlink(filePath,(err)=>{
        console.log('filePath-->',filePath)
        if(err){
        console.log(err);
        }
    })
}

