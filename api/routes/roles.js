const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Role = require('../models/roles')

const CircularJSON = require('circular-json');


router.get('/',(req,res,next)=>{
    const count = Role.countDocuments()
    const response ={
        "total":count
    }
    const page = req.query.p || 0
    const bookPerPage = 3

    Role.find()
    .skip(page*bookPerPage)
    .limit(bookPerPage)
    .exec().then(docs=>{
        console.log(docs);
        res.status(200).json({
            "status": true,
            "content": {
              "meta":{
                "total":bookPerPage,
                "pages": bookPerPage,
                "page": page
              },
              "data": {
                docs
              }
            }
          }
            
            
            
            
            );
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
    
})


router.post('/',(req,res,next)=>{
    
    const role = new Role({
        id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        created_at:req.body.created_at,
        updated_at:req.body.updated_at,
    });
    role.save().then(
        result => {console.log(result);
        res.status(200).json({
            "status": true,
            "content": {
              "data": {
                "id": result.id,
                "name": result.name,
                "created_at": result.created_at,
                "updated_at": result.updated_at
              }
              
            }
          })
        }
    ).catch(err=>console.log(err));
   
})

module.exports = router;