"use client";
import React, { useState } from 'react';
import './legal.scss';

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="legal">
      <div className="legal__container main-container">
        <header className="legal__header">
          <h1 className="legal__title">Mentions légales</h1>
          <nav className="legal__nav">
            <button 
              className={`legal__nav-button ${activeTab === 'terms' ? 'legal__nav-button--active' : ''}`}
              onClick={() => setActiveTab('terms')}
            >
              Conditions d&apos;utilisation
            </button>
            <button 
              className={`legal__nav-button ${activeTab === 'privacy' ? 'legal__nav-button--active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              Politique de confidentialité
            </button>
          </nav>
        </header>

        <div className="legal__content">
          {activeTab === 'terms' && (
            <section className="legal__section">
              <h2>Conditions générales d&apos;utilisation</h2>
              
              <div className="legal__article">
                <h3>1. Objet</h3>
                <p>
                  Les présentes conditions générales d&apos;utilisation (CGU) ont pour objet de définir les modalités 
                  et conditions d&apos;utilisation de la plateforme CheckPoint, projet de démonstration développé dans 
                  le cadre d&apos;un examen professionnel, ainsi que les droits et obligations de l&apos;utilisateur dans ce cadre.
                </p>
              </div>

              <div className="legal__article">
                <h3>2. Identification de l&apos;éditeur</h3>
                <p>
                  Le site CheckPoint est édité par :<br/>
                  <strong>Elodie FOUGEROUSE (Moonye)</strong><br/>
                  Projet d&apos;examen - Titre professionnel DWWM<br/>
                  123 Rue de l&apos;Exemple, 75000 Paris, France<br/>
                  Email : contact.checkpoint.moonye@exemple.fr
                </p>
                <p>
                  <em>Note : Ce site est développé dans le cadre d&apos;un projet de certification 
                  pour le titre professionnel &quot;Développeur Web et Web Mobile&quot; (DWWM).</em>
                </p>
              </div>

              <div className="legal__article">
                <h3>3. Description du service</h3>
                <p>
                  CheckPoint est une plateforme gamifiée permettant aux utilisateurs de :
                </p>
                <ul>
                  <li>Suivre leur progression dans leurs jeux vidéo</li>
                  <li>Gérer leur collection de jeux vidéo</li>
                  <li>Découvrir de nouveaux jeux</li>
                  <li>Partager leurs expériences de jeu</li>
                </ul>
              </div>

              <div className="legal__article">
                <h3>4. Accès au service</h3>
                <p>
                  L&apos;accès au service est gratuit pour les fonctionnalités de base. L&apos;utilisateur doit créer un compte 
                  en fournissant des informations exactes et à jour. L&apos;utilisateur s&apos;engage à :
                </p>
                <ul>
                  <li>Avoir au minimum 16 ans</li>
                  <li>Fournir des informations exactes lors de l&apos;inscription</li>
                  <li>Maintenir la confidentialité de ses identifiants</li>
                  <li>Respecter les autres utilisateurs et les règles de la communauté</li>
                </ul>
              </div>

              <div className="legal__article">
                <h3>5. Obligations de l&apos;utilisateur</h3>
                <p>L&apos;utilisateur s&apos;interdit de :</p>
                <ul>
                  <li>Publier des contenus illégaux, diffamatoires ou contraires aux bonnes mœurs</li>
                  <li>Utiliser le service à des fins commerciales non autorisées</li>
                  <li>Tenter de porter atteinte à la sécurité du système</li>
                  <li>Usurper l&apos;identité d&apos;autrui</li>
                </ul>
              </div>

              <div className="legal__article">
                <h3>6. Propriété intellectuelle</h3>
                <p>
                  Tous les éléments du site CheckPoint sont protégés par le droit d&apos;auteur, des marques ou des brevets. 
                  Ils sont la propriété exclusive de [NOM_EDITEUR] ou de ses partenaires.
                </p>
              </div>

              <div className="legal__article">
                <h3>7. Responsabilité</h3>
                <p>
                  [NOM_EDITEUR] s&apos;efforce d&apos;assurer la disponibilité du service mais ne peut garantir un accès 
                  permanent. La responsabilité de [NOM_EDITEUR] ne saurait être engagée en cas d&apos;interruption 
                  temporaire du service.
                </p>
              </div>

              <div className="legal__article">
                <h3>8. Résiliation</h3>
                <p>
                  L&apos;utilisateur peut supprimer son compte à tout moment depuis les paramètres de son profil. 
                  [NOM_EDITEUR] se réserve le droit de suspendre ou supprimer un compte en cas de non-respect 
                  des présentes conditions.
                </p>
              </div>

              <div className="legal__article">
                <h3>9. Droit applicable</h3>
                <p>
                  Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français 
                  seront seuls compétents.
                </p>
              </div>

              <div className="legal__article">
                <h3>10. Modification des CGU</h3>
                <p>
                  [NOM_EDITEUR] se réserve le droit de modifier les présentes CGU à tout moment. 
                  Les utilisateurs seront informés des modifications par email ou notification sur le site.
                </p>
              </div>
            </section>
          )}

          {activeTab === 'privacy' && (
            <section className="legal__section">
              <h2>Politique de confidentialité</h2>
              
              <div className="legal__article">
                <h3>1. Responsable du traitement</h3>
                <p>
                  Le responsable du traitement des données personnelles est :<br/>
                  <strong>Elodie FOUGEROUSE (Moonye)</strong><br/>
                  123 Rue de l&apos;Exemple, 75000 Paris, France<br/>
                  Email : contact.checkpoint.moonye@exemple.fr
                </p>
              </div>

              <div className="legal__article">
                <h3>2. Données collectées</h3>
                <p>Dans le cadre de l&apos;utilisation de CheckPoint, nous collectons :</p>
                <ul>
                  <li><strong>Données d&apos;inscription :</strong> pseudo, adresse email, mot de passe (chiffré)</li>
                  <li><strong>Données d&apos;utilisation :</strong> progression dans les jeux, collections, préférences, jeux likés, notes données aux jeux</li>
                  <li><strong>Données techniques :</strong> adresse IP, type de navigateur, données de connexion</li>
                  <li><strong>Cookies :</strong> cookies de session pour le fonctionnement de l&apos;application React/Symfony</li>
                </ul>
              </div>

              <div className="legal__article">
                <h3>3. Finalités du traitement</h3>
                <p>Vos données sont traitées pour :</p>
                <ul>
                  <li>Créer et gérer votre compte utilisateur</li>
                  <li>Fournir les services de la plateforme</li>
                  <li>Améliorer nos services et personnaliser votre expérience</li>
                  <li>Vous envoyer des communications importantes concernant le service</li>
                  <li>Assurer la sécurité et la protection contre la fraude</li>
                </ul>
              </div>

              <div className="legal__article">
                <h3>4. Base légale</h3>
                <p>Le traitement de vos données repose sur :</p>
                <ul>
                  <li><strong>Exécution du contrat :</strong> pour fournir les services demandés</li>
                  <li><strong>Intérêt légitime :</strong> pour améliorer nos services et assurer la sécurité</li>
                  <li><strong>Consentement :</strong> pour les communications marketing (optionnel)</li>
                </ul>
              </div>

              <div className="legal__article">
                <h3>5. Durée de conservation</h3>
                <p>
                  Vos données sont conservées :
                </p>
                <ul>
                  <li><strong>Compte actif :</strong> pendant toute la durée d&apos;utilisation du service</li>
                  <li><strong>Après suppression :</strong> 1 mois pour les données personnelles, 3 ans pour les données de connexion (obligations légales)</li>
                </ul>
              </div>

              <div className="legal__article">
                <h3>6. Partage des données</h3>
                <p>
                  Vos données ne sont pas vendues à des tiers. Elles peuvent être partagées uniquement avec :
                </p>
                <ul>
                  <li>Nos prestataires techniques (hébergement, maintenance) sous contrat de confidentialité</li>
                  <li>Les autorités compétentes en cas d&apos;obligation légale</li>
                </ul>
              </div>

              <div className="legal__article">
                <h3>7. Transferts internationaux</h3>
                <p>
                  Vos données sont hébergées en France sur un serveur local (phpMyAdmin) et ne font pas l&apos;objet 
                  de transferts vers des pays tiers. Ce projet étant développé à des fins pédagogiques, 
                  toutes les données restent sur le territoire français.
                </p>
              </div>

              <div className="legal__article">
                <h3>8. Vos droits (RGPD)</h3>
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul>
                  <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                  <li><strong>Droit à l&apos;effacement :</strong> supprimer vos données</li>
                  <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                  <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                  <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement</li>
                  <li><strong>Droit de retirer votre consentement</strong> à tout moment</li>
                </ul>
                <p>
                  Pour exercer ces droits, contactez-nous à : contact.checkpoint.moonye@exemple.fr<br/>
                  Réponse sous 1 mois maximum.
                </p>
              </div>

              <div className="legal__article">
                <h3>9. Cookies</h3>
                <p>
                  Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement de l&apos;application :
                </p>
                <ul>
                  <li><strong>Cookies de session :</strong> pour maintenir votre connexion</li>
                  <li><strong>Cookies techniques :</strong> pour le bon fonctionnement de React/Symfony</li>
                </ul>
                <p>
                  Aucun cookie publicitaire ou de tracking n&apos;est utilisé. Les cookies sont automatiquement 
                  supprimés à la fermeture de votre navigateur.
                </p>
              </div>

              <div className="legal__article">
                <h3>10. Sécurité</h3>
                <p>
                  Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger 
                  vos données : chiffrement des mots de passe, connexions sécurisées (HTTPS), accès restreints, 
                  sauvegardes régulières.
                </p>
              </div>

              <div className="legal__article">
                <h3>11. Réclamations</h3>
                <p>
                  En cas de préoccupation concernant le traitement de vos données, vous pouvez déposer une 
                  réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
                </p>
              </div>

              <div className="legal__article">
                <h3>12. Contact DPO</h3>
                <p>
                  [Si DPO désigné] Pour toute question relative à la protection des données :<br/>
                  DPO : [NOM_DPO]<br/>
                  Email : [EMAIL_DPO]
                </p>
              </div>

              <div className="legal__article">
                <h3>13. Mise à jour</h3>
                <p>
                  Cette politique de confidentialité peut être mise à jour. Vous serez informé des modifications 
                  importantes par email ou notification sur le site.
                </p>
                <p><strong>Dernière mise à jour :</strong> Janvier 2025</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
} 