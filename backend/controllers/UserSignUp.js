import bcrypt from 'bcrypt'
import {User} from '../models/user.js' 

export async function UserSignUp(req  , res) {

    const {name , email , password} = req.body

    if(!name || !email || !password) return res.send('insufficient Info')
    
    // hash password before storing it to db

    const hashedPassword = await bcrypt.hash(password , 12)

    const user = new User({
        name  : name , 
        email : email ,
        password : hashedPassword
    })

    await user.save();

    res.redirect('/login')
}