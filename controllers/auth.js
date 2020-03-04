const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({email: req.body.email})

    if(candidate) {
        // check pass, user exists
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if(passwordResult) {
            //token generated, passwords same
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn:60*60});
            res.status(200).json({
                token: `Bearer ${token}`
            })

        } else {
            //passwords different
            res.status(401).json({
                message: 'passwords do not match'})

        }
    } else {
        //passwords different
        // no user, error
        res.status(404).json({
            message: 'no user with such email'})
    }

}
module.exports.register = async function(req, res) {
//    const user = new User({
//        email: req.body.email,
//        password: req.body.password
//    })
//    user.save().then(()=>{console.log('user created')})

    const candidate = await User.findOne({email: req.body.email})
    if(candidate) {
//user exists erroe
        res.status(409).json({
            message: 'email already exists'
        })
    } else {
        const salt = bcrypt.genSaltSync(10)

//user not exists, create user
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt)
        })

        try{
            await user.save()
            res.status(201).json(user)
        } catch(e) {
            //handle error
            errorHandler(res, e)
        }

    }
}