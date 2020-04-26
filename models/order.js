const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const order = new Schema({
    user:{
        username:
        {
        type:String,
        required:true,
        ref:'user'
        },
        userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'user'
        },
    },
        products:[{
                        productData:{
                                type:Object,
                               required:true
                        },
                        quantity:{
                                type:Number,
                                required:true
                        }
                }]
            });
        
            module.exports = mongoose.model('order',order);