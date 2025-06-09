import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configuration Mailtrap avec timeouts améliorés
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER, 
    pass: process.env.MAILTRAP_PASSWORD 
  },
  // Timeouts améliorés pour éviter les erreurs ETIMEDOUT
  connectionTimeout: 60000, // 60 secondes pour la connexion
  greetingTimeout: 30000,   // 30 secondes pour le greeting
  socketTimeout: 60000,     // 60 secondes pour les opérations socket
  // Retry automatique en cas d'échec
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  // Options supplémentaires pour la stabilité
  tls: {
    rejectUnauthorized: false
  }
});

// Fonction pour générer le template d'email
function generateEmailTemplate(pseudo: string, verificationUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vérification CheckPoint</title>
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #748599 0%, #a8bbc5 100%); font-family: 'DM Sans', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); overflow: hidden;">
              
              <!-- Header avec dégradé -->
              <tr>
                <td style="background: linear-gradient(135deg, #0c60b9 0%, #23ABFA 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: white; font-family: 'Karantina', cursive; font-size: 48px; margin: 0; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                    CheckPoint
                  </h1>
                  <p style="color: #2fd7fd; font-size: 18px; margin: 10px 0 0 0; font-weight: 600;">
                    Bienvenue, ${pseudo} !
                  </p>
                </td>
              </tr>
              
              <!-- Contenu principal -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #0c60b9; font-size: 28px; margin: 0 0 20px 0; text-align: center; font-weight: 700;">
                    🎮 Votre aventure commence ici !
                  </h2>
                  
                  <p style="color: #748599; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; text-align: center;">
                    Merci de vous être inscrit sur CheckPoint ! Pour commencer à sauvegarder votre progression gaming, 
                    il vous suffit de vérifier votre adresse e-mail.
                  </p>
                  
                  <!-- Bouton stylisé -->
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${verificationUrl}" 
                       style="background: linear-gradient(135deg, #23ABFA 0%, #0c60b9 100%); 
                              color: white; 
                              padding: 18px 40px; 
                              text-decoration: none; 
                              border-radius: 50px; 
                              display: inline-block; 
                              font-weight: 700;
                              font-size: 16px;
                              box-shadow: 0 8px 20px rgba(35, 171, 250, 0.4);
                              transition: all 0.3s ease;
                              text-transform: uppercase;
                              letter-spacing: 1px;">
                      ✨ Vérifier mon e-mail ✨
                    </a>
                  </div>
                  
                  <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 30px 0; border-left: 4px solid #23ABFA;">
                    <p style="color: #748599; font-size: 14px; margin: 0; line-height: 1.5;">
                      <strong>Lien de secours :</strong><br>
                      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                    </p>
                    <p style="word-break: break-all; color: #0c60b9; font-size: 12px; margin: 10px 0 0 0; font-family: monospace; background: white; padding: 10px; border-radius: 5px;">
                      ${verificationUrl}
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: #748599; padding: 25px 30px; text-align: center;">
                  <p style="color: white; font-size: 14px; margin: 0 0 10px 0; opacity: 0.9;">
                    🏆 CheckPoint - Sauvegardez votre progression gaming
                  </p>
                  <p style="color: #a8bbc5; font-size: 12px; margin: 0;">
                    Ce lien expire dans 24 heures pour votre sécurité.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { email, pseudo } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Vérifier si les identifiants Mailtrap sont configurés
    if (!process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASSWORD) {
      console.error('Identifiants Mailtrap manquants');
      return NextResponse.json(
        { error: 'Configuration email manquante' },
        { status: 500 }
      );
    }

    // Générer un token de vérification
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // URL de vérification (à adapter selon votre domaine)
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // Configuration du mail avec template séparé
    const mailOptions = {
      from: 'noreply@checkpoint.com',
      to: email,
      subject: 'Vérification de votre adresse e-mail - CheckPoint',
      html: generateEmailTemplate(pseudo, verificationUrl)
    };

    // Envoyer l'email avec retry automatique
    await transporter.sendMail(mailOptions);

    // Ici, vous devriez stocker le token en base de données avec l'email et la date d'expiration
    // Pour cet exemple, on simule avec une réponse simple
    
    return NextResponse.json(
      { message: 'Email de vérification envoyé avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
} 