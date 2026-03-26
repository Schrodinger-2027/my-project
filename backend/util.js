import mongoose from 'mongoose'
import nodemailer from 'nodemailer';


export function connectDB(URL){
    mongoose.connect(URL)
    .then(()=>{
        console.log(`MongoDB Connected`)
    })
    .catch((err)=>{
        console.log('error is : ' , err)
    })
}


