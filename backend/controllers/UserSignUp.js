import bcrypt from 'bcrypt'
import {User} from '../models/user.js' 
import { sendEmail } from './sendEmail.js'
import { Otp } from '../models/otp.js'

export async function UserSignUp(req  , res) {

    const {name , email , password} = req.body

    if(!name || !email || !password) return res.send('insufficient Info')

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' })
    }
    
    // hash password before storing it to db
    const otp = Math.floor(100000 + Math.random() * 900000);
    await Otp.findOneAndUpdate(
        { email },
        { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
        { upsert: true, new: true }
    )

    await sendEmail(email , "OTP Verification"  , `<h3>Your Otp is ${otp}</h3>` )   

    res.status(200).json({
        message: "Signup successful"
    })
}