// Email verification template
export const registrationVerificationEmail = (otp, userName = "User") => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 10px;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
                font-weight: 300;
            }
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 20px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #2c3e50;
            }
            .message {
                font-size: 16px;
                margin-bottom: 30px;
                color: #555;
                line-height: 1.8;
            }
            .otp-container {
                background-color: #f8f9fa;
                border: 2px dashed #667eea;
                border-radius: 8px;
                padding: 25px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-label {
                font-size: 14px;
                color: #666;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #667eea;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                margin: 10px 0;
            }
            .otp-note {
                font-size: 12px;
                color: #888;
                margin-top: 10px;
            }
            .instructions {
                background-color: #e8f4fd;
                border-left: 4px solid #3498db;
                padding: 20px;
                margin: 25px 0;
                border-radius: 0 8px 8px 0;
            }
            .instructions h3 {
                color: #2c3e50;
                margin-bottom: 10px;
                font-size: 16px;
            }
            .instructions ul {
                margin-left: 20px;
                color: #555;
            }
            .instructions li {
                margin-bottom: 5px;
            }
            .footer {
                background-color: #2c3e50;
                color: white;
                padding: 25px 30px;
                text-align: center;
            }
            .footer p {
                font-size: 14px;
                margin-bottom: 10px;
            }
            .footer a {
                color: #3498db;
                text-decoration: none;
            }
            .expiry-warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
                text-align: center;
                font-size: 14px;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                margin: 20px 0;
            }
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                    border-radius: 5px;
                }
                .content {
                    padding: 20px 15px;
                }
                .otp-code {
                    font-size: 24px;
                    letter-spacing: 4px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 Email Verification</h1>
                <p>Expense Tracker App</p>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${userName}! 👋</div>
                
                <div class="message">
                    Thank you for signing up with Expense Tracker! We're excited to have you on board. 
                    To complete your registration and start managing your expenses, please verify your email address.
                </div>

                <div class="otp-container">
                    <div class="otp-label">Your Verification Code</div>
                    <div class="otp-code">${otp}</div>
                    <div class="otp-note">Enter this code in the app to verify your email</div>
                </div>

                <div class="expiry-warning">
                    ⏰ This code will expire in 5 minutes for security reasons
                </div>

                <div class="instructions">
                    <h3>How to verify your email:</h3>
                    <ul>
                        <li>Open the Expense Tracker app</li>
                        <li>Go to the verification screen</li>
                        <li>Enter the 6-digit code shown above</li>
                        <li>Click "Verify Email" to complete registration</li>
                    </ul>
                </div>

                <div class="message">
                    If you didn't create an account with Expense Tracker, please ignore this email. 
                    The verification code will expire automatically.
                </div>
            </div>
            
            <div class="footer">
                <p>This email was sent by Expense Tracker</p>
                <p>If you have any questions, please contact our support team</p>
                <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Password reset email template
export const passwordResetEmail = (otp, userName = "User") => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                color: white;
                padding: 30px 10px;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
                font-weight: 300;
            }
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 20px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #2c3e50;
            }
            .message {
                font-size: 16px;
                margin-bottom: 30px;
                color: #555;
                line-height: 1.8;
            }
            .otp-container {
                background-color: #f8f9fa;
                border: 2px dashed #e74c3c;
                border-radius: 8px;
                padding: 25px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-label {
                font-size: 14px;
                color: #666;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #e74c3c;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                margin: 10px 0;
            }
            .otp-note {
                font-size: 12px;
                color: #888;
                margin-top: 10px;
            }
            .security-warning {
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
                text-align: center;
                font-size: 14px;
            }
            .footer {
                background-color: #2c3e50;
                color: white;
                padding: 25px 30px;
                text-align: center;
            }
            .footer p {
                font-size: 14px;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔒 Password Reset</h1>
                <p>Expense Tracker App</p>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${userName}! 👋</div>
                
                <div class="message">
                    We received a request to reset your password for your Expense Tracker account. 
                    If you made this request, use the verification code below to reset your password.
                </div>

                <div class="otp-container">
                    <div class="otp-label">Your Reset Code</div>
                    <div class="otp-code">${otp}</div>
                    <div class="otp-note">Enter this code in the app to reset your password</div>
                </div>

                <div class="security-warning">
                    ⚠️ If you didn't request a password reset, please ignore this email and consider changing your password for security.
                </div>

                <div class="message">
                    This code will expire in 5 minutes. If you need a new code, you can request another password reset.
                </div>
            </div>
            
            <div class="footer">
                <p>This email was sent by Expense Tracker</p>
                <p>For security reasons, never share this code with anyone</p>
                <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Welcome email template (sent after successful verification)
export const welcomeEmail = (userName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Expense Tracker</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
                color: white;
                padding: 40px 5px;
                text-align: center;
            }
            .header h1 {
                font-size: 32px;
                margin-bottom: 10px;
                font-weight: 300;
            }
            .header p {
                font-size: 18px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 20px;
            }
            .greeting {
                font-size: 24px;
                margin-bottom: 20px;
                color: #2c3e50;
                text-align: center;
            }
            .message {
                font-size: 16px;
                margin-bottom: 30px;
                color: #555;
                line-height: 1.8;
                text-align: center;
            }
            .features {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 25px;
                margin: 30px 0;
            }
            .features h3 {
                color: #2c3e50;
                margin-bottom: 15px;
                text-align: center;
            }
            .feature-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
            }
            .feature-item {
                display: flex;
                align-items: center;
                padding: 10px;
                background-color: white;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .feature-icon {
                font-size: 24px;
                margin-right: 15px;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
                color: white;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                background-color: #2c3e50;
                color: white;
                padding: 25px 30px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome Aboard!</h1>
                <p>Your account is now verified and ready to use</p>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${userName}! 👋</div>
                
                <div class="message">
                    Congratulations! Your email has been successfully verified. 
                    You're now ready to start tracking your expenses and managing your finances like a pro!
                </div>

                <div class="features">
                    <h3>🚀 What you can do now:</h3>
                    <div class="feature-list">
                        <div class="feature-item">
                            <div class="feature-icon">💰</div>
                            <div>Track your daily expenses</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📊</div>
                            <div>View detailed analytics</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📱</div>
                            <div>Access from any device</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🔒</div>
                            <div>Secure data storage</div>
                        </div>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="#" class="cta-button">Start Tracking Expenses</a>
                </div>

                <div class="message">
                    If you have any questions or need help getting started, 
                    don't hesitate to reach out to our support team. We're here to help!
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing Expense Tracker!</p>
                <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
