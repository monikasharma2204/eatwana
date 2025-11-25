// Email template for user signup (WITHOUT password)
export const signupWelcomeEmail = (name) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Eatwana</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #e7582e 0%, #f27636 100%);">
                                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Welcome to Eatwana!</h1>
                            </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #125a69; margin-top: 0; font-size: 24px;">Hello ${name}! 👋</h2>
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                    Thank you for joining <strong style="color: #e7582e;">Eatwana</strong> - your trusted partner for delicious and healthy meals!
                                </p>
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                    We're excited to have you on board. Your account has been successfully created and you can now enjoy our meal services.
                                </p>
                                
                                <!-- Info Box -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f8f9fa; border-left: 4px solid #e7582e; border-radius: 4px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <h3 style="color: #125a69; margin-top: 0; font-size: 18px;">What's Next?</h3>
                                            <ul style="color: #333333; font-size: 14px; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
                                                <li>Browse our delicious meal plans and options</li>
                                                <li>Choose a subscription that fits your needs</li>
                                                <li>Enjoy fresh, healthy meals delivered to your doorstep</li>
                                            </ul>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- CTA Button -->
                                <table role="presentation" style="margin: 30px auto;">
                                    <tr>
                                        <td style="text-align: center;">
                                            <a href="https://eatwana.in" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #e7582e 0%, #f27636 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">Visit Eatwana</a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 30px 0 20px 0;">
                                    If you have any questions or need assistance, feel free to reach out to us. We're here to help!
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 30px; background-color: #125a69; color: #ffffff;">
                                <table role="presentation" style="width: 100%;">
                                    <tr>
                                        <td style="text-align: center; padding-bottom: 20px;">
                                            <h3 style="margin: 0 0 15px 0; font-size: 18px;">Stay Connected</h3>
                                            <div style="margin: 15px 0;">
                                                <a href="https://www.instagram.com/eatwana/" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none;">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" style="width: 30px; height: 30px; vertical-align: middle;">
                                                </a>
                                                <a href="https://www.facebook.com/profile.php?id=61583099625282" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none;">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" alt="Facebook" style="width: 30px; height: 30px; vertical-align: middle;">
                                                </a>
                                                <a href="https://wa.me/919708277467" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none;">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/174/174879.png" alt="WhatsApp" style="width: 30px; height: 30px; vertical-align: middle;">
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: center; font-size: 14px; line-height: 1.6; color: #ffffff;">
                                            <p style="margin: 10px 0;">📞 <strong>Phone:</strong> +91 97082 77467</p>
                                            <p style="margin: 10px 0;">📧 <strong>Email:</strong> eatwana@gmail.com</p>
                                            <p style="margin: 10px 0;">🌐 <strong>Website:</strong> <a href="https://eatwana.in" style="color: #f27636; text-decoration: none;">eatwana.in</a></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: center; padding-top: 20px; font-size: 12px; color: #cccccc;">
                                            <p style="margin: 5px 0;">&copy; ${new Date().getFullYear()} Eatwana. All rights reserved.</p>
                                            <p style="margin: 5px 0;">Delicious meals, delivered with love.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

// Email template for admin-created customer (WITH password)
export const adminCreatedWelcomeEmail = (name, email, password = "Eatwana@123") => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Eatwana</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #e7582e 0%, #f27636 100%);">
                                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Welcome to Eatwana!</h1>
                            </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #125a69; margin-top: 0; font-size: 24px;">Hello ${name}! 🎉</h2>
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                    Welcome to <strong style="color: #e7582e;">Eatwana</strong> - your trusted partner for delicious and healthy meals!
                                </p>
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                    Your account has been created successfully by our team. We're thrilled to have you join our food family and look forward to serving you delightful meals.
                                </p>
                                
                                <!-- Login Credentials Box -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f8f9fa; border-left: 4px solid #e7582e; border-radius: 4px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <h3 style="color: #125a69; margin-top: 0; font-size: 18px;">Your Login Credentials</h3>
                                            <p style="color: #333333; font-size: 14px; margin: 10px 0;">
                                                <strong>Email:</strong> ${email}
                                            </p>
                                            <p style="color: #333333; font-size: 14px; margin: 10px 0;">
                                                <strong>Password:</strong> ${password}
                                            </p>
                                            <p style="color: #e7582e; font-size: 13px; margin: 15px 0 0 0;">
                                                🔒 For your security, we recommend changing your password after your first login.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Info Box -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f8f9fa; border-left: 4px solid #e7582e; border-radius: 4px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <h3 style="color: #125a69; margin-top: 0; font-size: 18px;">What's Next?</h3>
                                            <ul style="color: #333333; font-size: 14px; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
                                                <li>Browse our delicious meal plans and options</li>
                                                <li>Choose a subscription that fits your needs</li>
                                                <li>Enjoy fresh, healthy meals delivered to your doorstep</li>
                                            </ul>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- CTA Button -->
                                <table role="presentation" style="margin: 30px auto;">
                                    <tr>
                                        <td style="text-align: center;">
                                            <a href="https://eatwana.in" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #e7582e 0%, #f27636 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">Explore Our Menu</a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Contact Info Box -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background: linear-gradient(135deg, #125a69 0%, #1a7585 100%); border-radius: 8px;">
                                    <tr>
                                        <td style="padding: 25px; color: #ffffff;">
                                            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #ffffff;">Need Assistance?</h3>
                                            <p style="margin: 10px 0; font-size: 14px; line-height: 1.6;">
                                                Our team is here to help! Reach out to us anytime:
                                            </p>
                                            <p style="margin: 10px 0; font-size: 14px;">
                                                📞 Call/WhatsApp: <strong>+91 97082 77467</strong>
                                            </p>
                                            <p style="margin: 10px 0; font-size: 14px;">
                                                📧 Email: <strong>eatwana@gmail.com</strong>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 30px 0 20px 0;">
                                    We're committed to providing you with the best meal experience. Thank you for choosing Eatwana!
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 30px; background-color: #125a69; color: #ffffff;">
                                <table role="presentation" style="width: 100%;">
                                    <tr>
                                        <td style="text-align: center; padding-bottom: 20px;">
                                            <h3 style="margin: 0 0 15px 0; font-size: 18px;">Stay Connected</h3>
                                            <div style="margin: 15px 0;">
                                                <a href="https://www.instagram.com/eatwana/" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none;">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" style="width: 30px; height: 30px; vertical-align: middle;">
                                                </a>
                                                <a href="https://www.facebook.com/profile.php?id=61583099625282" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none;">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" alt="Facebook" style="width: 30px; height: 30px; vertical-align: middle;">
                                                </a>
                                                <a href="https://wa.me/919708277467" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none;">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/174/174879.png" alt="WhatsApp" style="width: 30px; height: 30px; vertical-align: middle;">
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: center; font-size: 14px; line-height: 1.6; color: #ffffff;">
                                            <p style="margin: 10px 0;">📞 <strong>Phone:</strong> +91 97082 77467</p>
                                            <p style="margin: 10px 0;">📧 <strong>Email:</strong> eatwana@gmail.com</p>
                                            <p style="margin: 10px 0;">🌐 <strong>Website:</strong> <a href="https://eatwana.in" style="color: #f27636; text-decoration: none;">eatwana.in</a></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: center; padding-top: 20px; font-size: 12px; color: #cccccc;">
                                            <p style="margin: 5px 0;">&copy; ${new Date().getFullYear()} Eatwana. All rights reserved.</p>
                                            <p style="margin: 5px 0;">Delicious meals, delivered with love.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

// Usage in your signup function (NO password in email):
// await sendMail({
//     to: email,
//     subject: "Welcome to Eatwana - Account Created Successfully",
//     body: signupWelcomeEmail(name)
// });

// Usage in your createCustomer function (WITH password in email):
// if (email) {
//     await sendMail({
//         to: email,
//         subject: "Welcome to Eatwana - Your Account Details",
//         body: adminCreatedWelcomeEmail(name, email, "Eatwana@123")
//     });
// }