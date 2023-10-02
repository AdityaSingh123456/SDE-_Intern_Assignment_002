const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Member = require('../models/members')
const auth = require('../middleware/auth');
const Community = require('../models/communities')
const User = require('../models/user')

router.get('/',(req,res,next)=>{
    const page = req.query.p || 0
    const bookPerPage = 3

    Community.find({},{_id:0,__v:0})
    .select('id name slug owner created_at ')
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
              "data": 
                docs
              
              
            }

        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
    
})


router.post('/',auth,(req,res,next)=>{
    
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "adi");
    req.userData = decoded;
    User.find({email: req.userData.email}).exec().then(docs=>{
        const community = new Community({
        id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        slug:req.body.name.replace(/\s/g, '').toLowerCase(),
        owner:docs[0].id,
        created_at:req.body.created_at,
        updated_at:req.body.updated_at
        });
        console.log(docs);
        
    
        community.save().then(
            result => {console.log(result);
                res.status(200).json({
                    "status": true,
                    "content": {
                      "data": {
                        "id": result.id,
                        "name": result.name,
                        "slug": result.slug,
                        "owner": result.owner,
                        "created_at": result.created_at,
                        "updated_at": result.updated_at
                      }
                      
                    }
                  })
                }
        ).catch(err=>console.log(err));
        

    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })

    
    
    
})

router.get('/me/owner',auth,(req,res,next)=>{
    const page = req.query.p || 0
    const bookPerPage = 3
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "adi");
    req.userData = decoded;

    User.find({ email: req.userData.email }).then((user) => {
        
        if (user) {
            console.log("------------------------")
            // console.log(user[0].id)
            Community.find({owner: user[0].id}).exec().then(docs=>{
                
                console.log(docs);
                res.status(200).json({
                    "status": true,
                    "content": {
                        "meta":{
                            "total":bookPerPage,
                            "pages": bookPerPage,
                            "page": page
                          },
                        "data": docs
                    }
                })
            }).catch(err=>{
                console.log(err);
                res.status(500).json({
                    error:err
                })
            })

            
               // Outputs 30
        } else {
          console.log('User not found.');
        }
      });

    

 


    
});
router.get('/me/member',auth,(req,res,next)=>{
    const page = req.query.p || 0
    const bookPerPage = 3
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "adi");
    req.userData = decoded;

    User.find({ email: req.userData.email }).then((user) => {
        
        if (user) {
            console.log("------------------------")
            // console.log(user[0].id)
            Member.find({user: user[0].id}).exec().then(docs=>{
                Community.find({id: docs.community}).exec().then(community=>{
                    User.find({id: community.owner}).exec().then(user=>{
                
                
                        console.log(user);
                        res.status(200).json({
                            "status": true,
                             "content": {
                                 "meta":{
                                     "total":bookPerPage,
                                     "pages": bookPerPage,
                                     "page": page
                                   },
                                 "data": {
                                    "id": docs.id,
                                    "name":community.name,
                                     "slug": community.slug,
                                    "owner": {
                                    "id": user.id,
                                    "name": user.name
                                    },
                                "created_at": community.created_at,
                                "updated_at": community.updated_at
                                 }
                             }
                         })
                    }).catch(err=>{
                        console.log(err);
                        res.status(500).json({
                            error:err
                        })
                    })
                
                
                    
                }).catch(err=>{
                    console.log(err);
                    res.status(500).json({
                        error:err
                    })
                })

                
               
            }).catch(err=>{
                console.log(err);
                res.status(500).json({
                    error:err
                })
            })

            
               // Outputs 30
        } else {
          console.log('User not found.');
        }
      });

    

 


    
});



router.get('/:slug/members',(req,res,next)=>{
    const slug = req.params.slug;
    Member.find({slug:slug},{_id:0,__v:0})
    .select('')
    .exec().then(docs=>{
            User.find({id:docs.user},{_id:0,__v:0})
            .select('')
            .exec().then(user=>{
                res.status(200).json({
                    docs
                })


                
        }).catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
        // console.log(docs);
        // res.status(200).json({
        //     "status": true,
        //     "content": {
        //         "meta":{
        //             "total":bookPerPage,
        //             "pages": bookPerPage,
        //             "page": page
        //           },
        //       "data": 
        //         docs
              
              
        //     }

        // });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })



});




module.exports = router;