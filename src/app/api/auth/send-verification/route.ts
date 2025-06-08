import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configuration Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER, 
    pass: process.env.MAILTRAP_PASSWORD 
  }
});

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

    // Template d'email
    const mailOptions = {
      from: 'noreply@checkpoint.com',
      to: email,
      subject: 'Vérification de votre adresse e-mail - CheckPoint',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0c60b9;">Bienvenue sur CheckPoint, ${pseudo} !</h2>
          <p>Merci de vous être inscrit sur CheckPoint. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #23ABFA; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Vérifier mon adresse e-mail
            </a>
          </div>
          <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p><small>Ce lien expire dans 24 heures.</small></p>
        </div>
      `
    };

    // Envoyer l'email
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