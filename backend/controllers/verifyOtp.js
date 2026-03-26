import { User } from '../models/user.js'
import { Otp }  from '../models/otp.js'

export async function VerifyOtp(req, res) {
    try {
        const { email, otp } = req.body

        if (!email || !otp)
            return res.status(400).json({ message: 'Email and OTP are required' })

        const otpRecord = await Otp.findOne({ email })

        if (!otpRecord)
            return res.status(400).json({ message: 'OTP not found or expired' })

        if (otpRecord.otp !== otp)
            return res.status(400).json({ message: 'Invalid OTP' })

        if (otpRecord.expiresAt < new Date())
            return res.status(400).json({ message: 'OTP has expired' })

        
        await User.findOneAndUpdate({ email }, { verified: true })
        await Otp.deleteOne({ email })

        return res.status(200).json({ message: 'Email verified successfully' })

    } catch (err) {
        console.error('OTP verify error:', err)
        return res.status(500).json({ message: 'Server error' })
    }
}