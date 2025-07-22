import Image from "next/image";
import "./FollowCollection.scss";

const FollowCollection = () => {
  return (
    <section className="followCollection main-container" aria-label="Suivi de collection de jeux">
      <div className="followCollection-container">
        <div className="gameContainer" role="img" aria-label="Exemple de collection de jeux">
          <Image
            src="/images/NoLogin/Game-Home.png"
            alt="Collection de jeux vidéo - Interface de gestion"
            fill
            style={{ objectFit: "cover" }}
            className="gameImage"
          />
        </div>
        <div className="content">
          <h2 className="Title2-Karantina titleCollection">
            Suivez votre collection de jeux personnelle
          </h2>
          <p className="description Paragraphe1">
            Enregistrez vos jeux passés, en cours et à venir avec des
            fonctionnalités comme le suivi du temps, la journalisation et la
            gestion des plateformes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FollowCollection;
