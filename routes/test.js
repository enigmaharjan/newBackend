const express = require('express');
const router = express.Router();
const testModel = require('../models/test');
const jwt = require('jsonwebtoken');
const jwtMiddle = require('express-jwt-middleware');
const jwtCheck = jwtMiddle('secret');
const bcyrpt = require('bcryptjs');

router.route('/')
    .get( jwtCheck, async (req,res)=>{
        try{
            const data = await testModel.find({})
            res.json(data)
        }
        catch(err){
            res.json({message:err})
        }
    })
    .post( async (req,res)=>{
        const hash = await bcyrpt.hash(req.body.desc, 10);
        console.log(req.body)
        const post = new testModel({
            name: req.body.name,
            desc:hash,
            image:req.body.image
        })
        try{
            const data = await post.save()
            res.json(data)
        }
        catch(err){
            res.json({message:err})
        }
    })
    .delete(jwtCheck, async(req,res)=>{
        try{
            const data = await testModel.deleteMany()
            res.json(data)
        }
        catch(err){
            res.json({message:err})
        }
    })
router.route('/:id')
    .get( async (req,res)=>{
        try{
            const data = await testModel.findById({_id:req.params.id})
            res.json(data)
        }
        catch(err){
            res.json({message:err})
        }
    })
    .put( async (req, res)=>{
        try{
            const data = await testModel.updateOne({_id:req.params.id},
                {
                    $set: {
                        name: req.body.name,
                        desc:req.body.desc,
                        image:req.body.image
                    }
                })
            res.json(data)
        }
        catch(err){
            res.json({message:err})
        }
    })
    .delete( async (req, res)=>{
        try{
            const data = await testModel.deleteOne({_id:req.params.id})
            res.json(data)
        }
        catch(err){
            res.json({message:err})
        }
    })
router.route('/login')
    .post( async(req,res)=>{
        const name = req.body.name;
        const password = req.body.desc;
        try{

            const data = await testModel.findOne({name:name})
            console.log(data)
            const auth = bcyrpt.compareSync(password, data.desc);
            if(auth){
                const token = jwt.sign({ name: name }, 'secret');
                res.json({
                    success: 'true',
                    message: 'Welcome, ' + name,
                    accessToken: token
                })
            }
            else{
                res.json('Error')
            }
        }
        catch(err){
            res.json({message:err})
        }

    })
    module.exports = router;

