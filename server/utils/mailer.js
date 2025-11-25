import nodemailer from 'nodemailer'

export const sendMail = async ({ to, subject, body }) => {
    try {


        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "eatwana@gmail.com",
                pass: "omyapotjyialgauz", // Ensure you're using an app-specific password
            },
            tls: {
                rejectUnauthorized: false, // This can sometimes help avoid spam filters
            },
        });

        // const emailFormat = {
        //     from: 'biharilibrary@gmail.com', // sender address
        //     text: "Bihari Library",
        //     to: to, // list of receivers
        //     subject: subject, // Subject line
        //     html: body, // html body
        // }
        const emailFormat = {
            from: '"Eatwana" <eatwana@gmail.com>', // Include a clear display name
            to: to,
            subject: subject,
            text: "Eatwana", // Consider adding a plaintext version of the email
            html: body,
            headers: {
                'X-Priority': '3', // Normal priority
            },
        };
        const info = await transporter.sendMail(emailFormat)
        console.log(info.messageId)

    } catch (error) {
        console.log(error)
    }
}