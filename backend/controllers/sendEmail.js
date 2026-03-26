import nodemailer from 'nodemailer'
export async function sendEmail(to , subject , html){

    const transporter = nodemailer.createTransport({
        host : "smtp.gmail.com" , 
        auth : { 
            user : process.env.SMTP_USER ,
            pass : process.env.SMTP_PASS
        }
    })
     try {
        const info = await transporter.sendMail({
            from : process.env.SMTP_USER,
            to : to,
            subject : subject,
            html : html
        });

        console.log("Email sent:", info.messageId);

    } catch (error) {
        console.error("Email error:", error);
    }
}