import { Otp } from '../models/otp.js'
import { User } from '../models/user.js'

export async function VerifyOtp(req, res) {
    const { email, otp } = req.body

    if (!email || !otp) 
        return res.status(400).json({ message: 'Email and OTP are required' })

    const record = await Otp.findOne({ email })

    if (!record) 
        return res.status(404).json({ message: 'OTP not found. Please sign up again.' })

    if (record.expiresAt < new Date()) {
        await Otp.deleteOne({ email })
        return res.status(410).json({ message: 'OTP expired. Please sign up again.' })
    }

    if (String(record.otp) !== String(otp)) 
        return res.status(401).json({ message: 'Invalid OTP' })

    // OTP is valid — now save the user
    const { name, email: userEmail, password } = record.tempUser

    const user = new User({ name, email: userEmail, password })
    await user.save()

    // Clean up OTP record
    await Otp.deleteOne({ email })

    res.status(201).json({ message: "Signup successful" })
}