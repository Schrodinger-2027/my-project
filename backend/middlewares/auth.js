import jwt from 'jsonwebtoken'

export async function verifyToken(token){
    try {
        const decoded = await jwt.verify(token , process.env.SECRET_KEY)
        return decoded   
    } catch (error) {
        return null 
    }
}