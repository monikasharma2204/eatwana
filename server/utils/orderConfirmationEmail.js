import { sendMail } from "./mailer.js";

// Email template generator for order confirmation and invoice
export const generateOrderConfirmationEmail = (orderData) => {
    const {
        customerName,
        orderId,
        orderDate,
        items,
        totalAmount,
        paymentMethod,
        address,
        invoiceId,
        invoiceType, // 'dish', 'tiffin', or 'mealPlan'
        utrNumber,
        orderStatus
    } = orderData;

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://eatwana.in';
    const invoiceLink = `${FRONTEND_URL}/invoice/${invoiceId}`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Eatwana</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #e7582e 0%, #f27636 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .header p {
            font-size: 16px;
            opacity: 0.95;
        }
        .success-icon {
            width: 60px;
            height: 60px;
            background-color: #ffffff;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
        }
        .success-icon::after {
            content: "✓";
            color: #e7582e;
            font-size: 36px;
            font-weight: bold;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .order-info {
            background-color: #f9f9f9;
            border-left: 4px solid #125a69;
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 4px;
        }
        .order-info h2 {
            color: #125a69;
            font-size: 18px;
            margin-bottom: 15px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            color: #666;
            font-weight: 500;
        }
        .info-value {
            color: #333;
            font-weight: 600;
        }
        .items-section {
            margin-bottom: 25px;
        }
        .items-section h3 {
            color: #125a69;
            font-size: 16px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e7582e;
        }
        .item {
            padding: 12px;
            margin-bottom: 10px;
            background-color: #fafafa;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .item-details {
            flex: 1;
        }
        .item-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }
        .item-meta {
            font-size: 13px;
            color: #666;
        }
        .item-price {
            font-weight: 700;
            color: #e7582e;
            font-size: 16px;
        }
        .total-section {
            background-color: #125a69;
            color: white;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 25px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .total-amount {
            font-size: 24px;
            font-weight: 700;
        }
        .cta-button {
            display: block;
            background: linear-gradient(135deg, #e7582e 0%, #f27636 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 6px;
            text-align: center;
            font-weight: 600;
            font-size: 16px;
            margin: 25px 0;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .address-section {
            background-color: #f0f8ff;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 25px;
        }
        .address-section h4 {
            color: #125a69;
            margin-bottom: 8px;
        }
        .address-section p {
            color: #555;
            line-height: 1.6;
        }
        .footer {
            background-color: #125a69;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .contact-info {
            margin-bottom: 20px;
        }
        .contact-item {
            margin: 8px 0;
            font-size: 14px;
        }
        .contact-item a {
            color: #f27636;
            text-decoration: none;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: white;
            text-decoration: none;
            font-size: 14px;
            padding: 8px 15px;
            background-color: rgba(255,255,255,0.1);
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        .social-links a:hover {
            background-color: rgba(255,255,255,0.2);
        }
        .footer-note {
            font-size: 12px;
            color: rgba(255,255,255,0.8);
            margin-top: 20px;
            line-height: 1.5;
        }
        @media only screen and (max-width: 600px) {
            .email-container {
                border-radius: 0;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .info-row {
                flex-direction: column;
                gap: 5px;
            }
            .item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="success-icon"></div>
            <h1>Order Confirmed!</h1>
            <p>Thank you for choosing Eatwana</p>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">Dear ${customerName},</p>
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Your order has been successfully placed and confirmed! We're excited to prepare your delicious meal.
            </p>

            <!-- Order Information -->
            <div class="order-info">
                <h2>📋 Order Details</h2>
                <div class="info-row">
                    <span class="info-label">Order ID:</span>
                    <span class="info-value">#${orderId}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Order Date:</span>
                    <span class="info-value">${new Date(orderDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Payment Method:</span>
                    <span class="info-value">${paymentMethod.toUpperCase()}</span>
                </div>
                ${utrNumber ? `
                <div class="info-row">
                    <span class="info-label">UTR Number:</span>
                    <span class="info-value">${utrNumber}</span>
                </div>
                ` : ''}
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value" style="color: #28a745;">${orderStatus.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
            </div>

            <!-- Items Section -->
            <div class="items-section">
                <h3>🍽️ Your Items</h3>
                ${items.map(item => `
                    <div class="item">
                        <div class="item-details">
                            <div class="item-name">${item.itemName}</div>
                            <div class="item-meta">
                                Quantity: ${item.quantity}
                                ${item.selectedVariant ? ` | Variant: ${item.selectedVariant}` : ''}
                                ${item.deliveryTimings && item.deliveryTimings.length > 0 ? ` | Timings: ${item.deliveryTimings.join(', ')}` : ''}
                            </div>
                        </div>
                        <div class="item-price">₹${item.totalPrice || (item.unitPrice * item.quantity)}</div>
                    </div>
                `).join('')}
            </div>

            <!-- Total Amount -->
            <div class="total-section">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>₹${totalAmount}</span>
                </div>
                <div class="total-row" style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px; margin-top: 10px;">
                    <span class="total-amount">Total Amount:</span>
                    <span class="total-amount">₹${totalAmount}</span>
                </div>
            </div>

            <!-- Delivery Address -->
            <div class="address-section">
                <h4>📍 Delivery Address</h4>
                <p>${address}</p>
            </div>

            <!-- Download Invoice Button -->
            <a href="${invoiceLink}" class="cta-button">
                📄 Download Invoice
            </a>

            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 20px;">
                Click the button above to view and download your invoice
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <h3 style="margin-bottom: 15px;">Contact Us</h3>
            <div class="contact-info">
                <div class="contact-item">
                    📧 Email: <a href="mailto:eatwana@gmail.com">eatwana@gmail.com</a>
                </div>
                <div class="contact-item">
                    📱 Phone: <a href="tel:+919708277467">+91 97082 77467</a>
                </div>
                <div class="contact-item">
                    💬 WhatsApp: <a href="https://wa.me/919708277467">+91 97082 77467</a>
                </div>
                <div class="contact-item">
                    🌐 Website: <a href="https://eatwana.in">eatwana.in</a>
                </div>
                <div class="contact-item" style="margin-top: 10px;">
                    📍 D.V.C, Road, Gardanibhag, Patna - 1
                </div>
            </div>

            <div class="social-links">
                <a href="https://www.instagram.com/eatwana/">Instagram</a>
                <a href="https://www.facebook.com/profile.php?id=61583099625282">Facebook</a>
            </div>

            <div class="footer-note">
                This is an automated email. Please do not reply to this message.<br>
                For any queries, please contact us using the details above.<br>
                © ${new Date().getFullYear()} Eatwana. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

// Usage example in your order controller
export const sendOrderConfirmationEmail = async (order, invoice, customer) => {
    try {
        const emailData = {
            customerName: customer.name,
            orderId: order._id.toString().slice(-8).toUpperCase(),
            orderDate: order.createdAt,
            items: invoice.items || order.dishItemsData.concat(order.tiffinItemsData),
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            address: order.address,
            invoiceId: invoice._id,
            invoiceType: invoice.invoiceType,
            utrNumber: order.utrNumber,
            orderStatus: order.orderStatus
        };

        const emailBody = generateOrderConfirmationEmail(emailData);

        await sendMail({
            to: customer.email,
            subject: `Order Confirmed - #${emailData.orderId} | Eatwana`,
            body: emailBody
        });

        console.log(`✅ Order confirmation email sent to ${customer.email}`);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

// For meal plan invoices
export const generateMealPlanInvoiceEmail = (invoiceData) => {
    const {
        customerName,
        invoiceId,
        mealPlanDetails,
        tokensGenerated,
        previousBalance,
        newBalance,
        totalAmount,
        paymentMethod,
        address,
        utrNumber
    } = invoiceData;

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const invoiceLink = `${FRONTEND_URL}/invoice/${invoiceId}`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meal Plan Activated - Eatwana</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #125a69 0%, #1a7a8c 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .header p {
            font-size: 16px;
            opacity: 0.95;
        }
        .success-icon {
            width: 60px;
            height: 60px;
            background-color: #ffffff;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
        }
        .success-icon::after {
            content: "🎟️";
            font-size: 36px;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .token-highlight {
            background: linear-gradient(135deg, #e7582e 0%, #f27636 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            margin: 25px 0;
        }
        .token-highlight h2 {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .token-highlight p {
            font-size: 16px;
            opacity: 0.95;
        }
        .plan-info {
            background-color: #f9f9f9;
            border-left: 4px solid #125a69;
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 4px;
        }
        .plan-info h3 {
            color: #125a69;
            margin-bottom: 15px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            color: #666;
            font-weight: 500;
        }
        .info-value {
            color: #333;
            font-weight: 600;
        }
        .token-balance {
            background-color: #f0f8ff;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 25px;
        }
        .balance-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 16px;
        }
        .balance-current {
            color: #28a745;
            font-weight: 700;
            font-size: 20px;
        }
        .cta-button {
            display: block;
            background: linear-gradient(135deg, #e7582e 0%, #f27636 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 6px;
            text-align: center;
            font-weight: 600;
            font-size: 16px;
            margin: 25px 0;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background-color: #125a69;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .contact-info {
            margin-bottom: 20px;
        }
        .contact-item {
            margin: 8px 0;
            font-size: 14px;
        }
        .contact-item a {
            color: #f27636;
            text-decoration: none;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: white;
            text-decoration: none;
            font-size: 14px;
            padding: 8px 15px;
            background-color: rgba(255,255,255,0.1);
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        .social-links a:hover {
            background-color: rgba(255,255,255,0.2);
        }
        .footer-note {
            font-size: 12px;
            color: rgba(255,255,255,0.8);
            margin-top: 20px;
            line-height: 1.5;
        }
        @media only screen and (max-width: 600px) {
            .email-container {
                border-radius: 0;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .info-row, .balance-item {
                flex-direction: column;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="success-icon"></div>
            <h1>Meal Plan Activated!</h1>
            <p>Your subscription is now active</p>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">Dear ${customerName},</p>
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Congratulations! Your meal plan has been successfully activated. You can now start enjoying delicious meals every day!
            </p>

            <!-- Token Highlight -->
            <div class="token-highlight">
                <h2>${tokensGenerated}</h2>
                <p>Meal Tokens Generated</p>
            </div>

            <!-- Plan Information -->
            <div class="plan-info">
                <h3>📋 Plan Details</h3>
                <div class="info-row">
                    <span class="info-label">Meal Plan:</span>
                    <span class="info-value">${mealPlanDetails.menuName || 'Custom Plan'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Meals Per Day:</span>
                    <span class="info-value">${mealPlanDetails.mealsPerDay}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Duration:</span>
                    <span class="info-value">${mealPlanDetails.days} days</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Total Meals:</span>
                    <span class="info-value">${mealPlanDetails.totalMeals}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Meal Slots:</span>
                    <span class="info-value">${mealPlanDetails.mealSlots.join(', ')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Amount Paid:</span>
                    <span class="info-value">₹${totalAmount}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Payment Method:</span>
                    <span class="info-value">${paymentMethod.toUpperCase()}</span>
                </div>
                ${utrNumber ? `
                <div class="info-row">
                    <span class="info-label">UTR Number:</span>
                    <span class="info-value">${utrNumber}</span>
                </div>
                ` : ''}
            </div>

            <!-- Token Balance -->
            <div class="token-balance">
                <h3 style="color: #125a69; margin-bottom: 15px;">🎟️ Token Balance</h3>
                <div class="balance-item">
                    <span>Previous Balance:</span>
                    <span>${previousBalance} tokens</span>
                </div>
                <div class="balance-item">
                    <span>Tokens Added:</span>
                    <span style="color: #28a745;">+${tokensGenerated} tokens</span>
                </div>
                <div class="balance-item" style="border-top: 2px solid #125a69; padding-top: 15px; margin-top: 10px;">
                    <span style="font-weight: 700;">Current Balance:</span>
                    <span class="balance-current">${newBalance} tokens</span>
                </div>
            </div>

            <p style="background-color: #fff3cd; padding: 15px; border-radius: 6px; color: #856404; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                <strong>💡 How it works:</strong> Each meal you order will deduct one token from your balance. You can track your token balance anytime in your account dashboard.
            </p>

            <!-- Download Invoice Button -->
            <a href="${invoiceLink}" class="cta-button">
                📄 Download Invoice
            </a>

            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 20px;">
                Need help? Contact us anytime!
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <h3 style="margin-bottom: 15px;">Contact Us</h3>
            <div class="contact-info">
                <div class="contact-item">
                    📧 Email: <a href="mailto:eatwana@gmail.com">eatwana@gmail.com</a>
                </div>
                <div class="contact-item">
                    📱 Phone: <a href="tel:+919708277467">+91 97082 77467</a>
                </div>
                <div class="contact-item">
                    💬 WhatsApp: <a href="https://wa.me/919708277467">+91 97082 77467</a>
                </div>
                <div class="contact-item">
                    🌐 Website: <a href="https://eatwana.in">eatwana.in</a>
                </div>
                <div class="contact-item" style="margin-top: 10px;">
                    📍 D.V.C, Road, Gardanibhag, Patna - 1
                </div>
            </div>

            <div class="social-links">
                <a href="https://www.instagram.com/eatwana/">Instagram</a>
                <a href="https://www.facebook.com/profile.php?id=61583099625282">Facebook</a>
            </div>

            <div class="footer-note">
                This is an automated email. Please do not reply to this message.<br>
                For any queries, please contact us using the details above.<br>
                © ${new Date().getFullYear()} Eatwana. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
    `;
};