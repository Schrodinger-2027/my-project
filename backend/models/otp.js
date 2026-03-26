import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    email:     { type: String, required: true, unique: true },
    otp:       { type: Number, required: true },
    expiresAt: { type: Date,   required: true },
    tempUser: {
        name:     String,
        email:    String,
        password: String,
    }
})

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Otp = mongoose.model('otps', otpSchema)