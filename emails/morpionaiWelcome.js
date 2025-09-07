import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendMorpionAIWelcomeEmail({ email, username }) {
  const msg = {
    to: email,
    from: "info@morpionai.com",
    subject: "Welcome to MorpionAI! ",
    text: "Welcome to MorpionAI!",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MorpionAI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            line-height: 1.6;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .tagline {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .welcome-title {
            font-size: 28px;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .welcome-message {
            font-size: 16px;
            color: #555;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .features {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
        }
        
        .features h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .feature-list {
            list-style: none;
            padding: 0;
        }
        
        .feature-list li {
            padding: 8px 0;
            color: #555;
            position: relative;
            padding-left: 25px;
        }
        
        .feature-list li:before {
            content: "🎯";
            position: absolute;
            left: 0;
            top: 8px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .footer-text {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .social-links {
            margin-top: 15px;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 10px;
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
                padding: 25px 20px;
            }
            
            .welcome-title {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo"> MorpionAI</div>
            <div class="tagline">Multiplayer Tic-Tac-Toe Platform</div>
        </div>
        
        <div class="content">
            <h1 class="welcome-title">Welcome to MorpionAI, ${username}! 🎉</h1>
            
            <p class="welcome-message">
                You're now part of our exciting community of Tic-Tac-Toe players! 
                Get ready to challenge other players, climb the leaderboard, and have fun with strategic gameplay.
            </p>
            
            <div class="features">
                <h3>What you can do on MorpionAI:</h3>
                <ul class="feature-list">
                    <li>Play Tic-Tac-Toe against real players from around the world</li>
                    <li>Join game rooms and compete in tournaments</li>
                    <li>Track your wins, losses, and overall performance</li>
                    <li>Climb the leaderboard and earn points</li>
                    <li>Create and join events with other players</li>
                    <li>Build your gaming profile and reputation</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="https://morpionai.com" class="cta-button">Start Playing Now! 🚀</a>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
                If you have any questions or need help getting started, 
                don't hesitate to reach out to our support team.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                © 2024 MorpionAI. All rights reserved.<br>
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
    })
    .catch((error) => {
      console.error('Error sending welcome email:', error.response?.body || error);
    });
}

export default sendMorpionAIWelcomeEmail; 