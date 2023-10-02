const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Community = require('../models/communities')
const Member = require('../models/members')
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const Role = require('../models/roles')

router.post('/',auth,(req,res,next)=>{
    const member = new Member({
        id: new mongoose.Types.ObjectId(),
        community: req.body.community,
        user:req.body.user,
        role:req.body.role,
        created_at:req.body.created_at
    });

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "adi");
    req.userData = decoded;
    User.find({email: req.userData.email}).exec().then((user)=>{
        console.log(user)
        console.log(req.body.community)
        Community.find({ owner: user[0].id}).then((docs) => {
            console.log(docs)  
            if (user[0].id === docs[0].owner) {
                console.log("------------------------")
                // console.log(user[0].id)
                member.save().then(
                    result => {console.log("hjv");
                        res.status(200).json({
                            "status": true,
                            "content": {
                              "data": {
                                "id": user[0].id,
                                "community": docs[0].id,
                                "role": req.body.role,
                                "created_at": result.created_at
                              }
                              
                            }
                          })
                        }
                ).catch(err=>{
                    console.log(err);
                    res.status(500).json({
                        error:err
                    })
                })
                
                   // Outputs 30
            } else {
              console.log('NOT_ALLOWED_ACCESS ');
              res.status(500).json({
                error: 'NOT_ALLOWED_ACCESS'
              });
            }
          });



    
      });

        

    


})



router.delete("/:memberId",auth, (req, res, next) => {
    const id = req.params.memberId;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "adi");
    req.userData = decoded;
    User.find({email: req.userData.email}).exec().then((user)=>{
        
        Member.find({ user: user[0].id }).then((member) => {
            if(member.length==0){
                console.log('NOT_ALLOWED_ACCESS ');
                res.status(500).json({
                        error: 'CHECK YOUR DETAILS YOU MIGHT MISSING SOMETHING'
                   });
            }
            
            Role.find({id:member[0].role}).then((role)=>{
                if(role.length===0){
                    console.log('NOT_ALLOWED_ACCESS ');
                    res.status(500).json({
                            error: 'CHECK YOUR DETAILS YOU MIGHT MISSING SOMETHING'
                       });
                }

                
                
                if(role.length>=1 && (role[0].name ==='Community Admin' || role[0].name ==='Community Moderator')){
                    
                    Member.deleteOne({ id:id })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: 'Product deleted',
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error:err
                        });
                    });

                }else{
                    console.log('NOT_ALLOWED_ACCESS ');
                    res.status(500).json({
                            error: 'NOT_ALLOWED_ACCESS'
                       });
                }
            });
        
            
          });



    
      });




  });



module.exports = router;