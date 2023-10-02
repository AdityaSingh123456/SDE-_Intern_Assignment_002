const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');

router.get('/me',auth,(req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "adi");
    req.userData = decoded;
    
    User.find({email: req.userData.email}).exec().then(docs=>{
        console.log(docs);
        res.status(200).json({
            "status": true,
            "content": {
                "data": {
                  "id":docs[0].id,
                  "name": docs[0].name,
                  "email": docs[0].email,
                  "created_at": docs[0].created_at
                }
            }
          });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })


    

});



router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Mail exists"
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const user = new User({
                id: new mongoose.Types.ObjectId(),
                name:req.body.name,
                email: req.body.email,
                password: hash
              });
              user
                .save()
                .then(result => {
                  console.log(result);
                  const token = jwt.sign({
                    email:result.email,
                    userId :result.id
                },"adi",
                {
                    expiresIn:"6h"
                })

                  res.status(201).json({
                    "status": true,
                    "content": {
                        "data": {
                          "id": result.id,
                          "name": result.name,
                          "email": result.email,
                          "created_at": result.created_at
                        },
                        "meta": {
                          "access_token": token
                        }
                    }
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        }
      });
  });

  router.post('/signin',(req,res,next)=>{
    
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            console.log(user)
            return res.status(401).json({
                message:"Auth failed"
            });
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message:'Auth failed'
                });
            }
            if(result){
                
                return res.status(200).json({
                    "status": true,
                    "content": {
                        "data": {
                          "id":user[0].id,
                          "name": user[0].name,
                          "email": user[0].email,
                          "created_at": user[0].created_at
                        }
                    }
                    

                });
            }
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  })

module.exports = router;