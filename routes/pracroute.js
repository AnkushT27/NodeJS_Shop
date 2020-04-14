const express = require('express');
const path = require('path');
const rootdir = require('../util/path');
const router = express.Router();
const users = [];
router.get('',(req,res,next)=>{
   res
   //.sendFile(path.join(rootdir,'views','test.html'))
   .render('users.ejs',{users:users,pagetitle:'Users'})
})

router.get('/users',(req,res,next)=>{
    res.
    //sendFile(path.join(rootdir,'views','test.html'))
    render('add-form.ejs',{pagetitle:'Users'})
})

router.post('/users',(req,res,next)=>{
   users.push({name:req.body.name});
   res.redirect('/practice');
})


module.exports = router;