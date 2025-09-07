import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
function sendCode({ code, email }) {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL || "noreply@yourapp.com",
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -1px;
        }
        
        .tagline {
            font-size: 16px;
            font-weight: 400;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        
        .title {
            font-size: 28px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 16px;
        }
        
        .description {
            font-size: 16px;
            color: #666666;
            line-height: 1.6;
            margin-bottom: 32px;
        }
        
        .code-container {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
            display: inline-block;
        }
        
        .verification-code {
            font-size: 36px;
            font-weight: 700;
            color: #667eea;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
        }
        
        .warning {
            font-size: 14px;
            color: #94a3b8;
            margin-top: 24px;
            padding: 16px;
            background: #f1f5f9;
            border-radius: 8px;
            border-left: 4px solid #e2e8f0;
        }
        
        .footer {
            background: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
            font-size: 14px;
            color: #64748b;
            line-height: 1.5;
        }
        
        .social-links {
            margin-top: 16px;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 8px;
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 12px;
            }
            
            .header, .content, .footer {
                padding: 24px 20px;
            }
            
            .verification-code {
                font-size: 28px;
                letter-spacing: 2px;
            }
            
            .title {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Your App</div>
            <div class="tagline"></div>
        </div>
        
        <div class="content">
            <h1 class="title">Verify Your Account</h1>
            <p class="description">
                Welcome! To complete your registration, please use the verification code below:
            </p>
            
            <div class="code-container">
                <div class="verification-code">${code}</div>
            </div>
            
            <div class="warning">
                <strong>Security Notice:</strong> This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                © 2024 Your App. All rights reserved.<br>
                This email was sent to ${email}
            </p>
            <div class="social-links">
                <a href="#" class="social-link">Privacy Policy</a>
                <a href="#" class="social-link">Terms of Service</a>
                <a href="#" class="social-link">Support</a>
            </div>
        </div>
    </div>
</body>
</html>`,
  };
  
  sgMail
    .send(msg)
    .then(() => {
      console.log('Verification email sent successfully to:', email);
    })
    .catch((error) => {
      console.error('Error sending verification email:', error.response?.body || error);
    });
}

export default sendCode;
