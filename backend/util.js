import mongoose from 'mongoose'

export function connectDB(URL){
    mongoose.connect(URL)
    .then(()=>{
        console.log(`MongoDB Connected`)
    })
    .catch((err)=>{
        console.log('error is : ' , err)
    })
}

