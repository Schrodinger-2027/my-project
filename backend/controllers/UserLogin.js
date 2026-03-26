import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

export async function userLogin(req , res){

    const {email , password} = req.body

    if(!email || !password) return res.send('provide each details')

    const user = await User.findOne({email : email})

    if(!user) return res.send('Wrong Credentials')

    // const isCorrect = await bcrypt.compare(password , user.password)

    // if(!isCorrect) return res.send('Credentials are Wrong')

    const token = jwt.sign({userId : user._id , name : user.name , email : user.email} , process.env.SECRET_KEY)

    res.setHeader("Authorization" , `Bearer ${token}`)

    res.json({
        message : "User Authenticated" , 
        token : token
    })
}