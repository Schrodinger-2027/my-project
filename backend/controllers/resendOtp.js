import { User } from '../models/user.js'
import { Otp }  from '../models/otp.js'
import { sendEmail } from './sendEmail.js'

export async function ResendOtp(req, res) {
    try {
        const { email } = req.body

        if (!email)
            return res.status(400).json({ message: 'Email is required' })

        const user = await User.findOne({ email })
        if (!user)
            return res.status(404).json({ message: 'User not found' })

        if (user.verified)
            return res.status(400).json({ message: 'Email already verified' })

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        await Otp.findOneAndUpdate(
            { email },
            { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
            { upsert: true, new: true }
        )

        await sendEmail(
            email,
            'Your new OTP — ChatRoom',
            `<div style="font-family:monospace;padding:20px">
                <h2>New OTP Code</h2>
                <p style="font-size:32px;letter-spacing:8px;font-weight:bold">${otp}</p>
                <p>Expires in <strong>10 minutes</strong>.</p>
            </div>`
        )

        return res.status(200).json({ message: 'New OTP sent' })

    } catch (err) {
        console.error('Resend OTP error:', err)
        return res.status(500).json({ message: 'Server error' })
    }
}