import Image from "next/image";
import "./FollowCollection.css";

const FollowCollection = () => {
  return (
    <section className="followCollection">
      <div className="gameContainer">
        <Image
          src="/images/NoLogin/Game-Home.png"
          alt="Games cover"
          width={400}
          height={300}
          className="gameImage"
        />
      </div>
      <div className="content">
        <h2 className="title">Suivez votre collection de jeux personnelle</h2>
        <p className="description">
          Enregistrez vos jeux passés, en cours et à venir avec des
          fonctionnalités comme le suivi du temps, la journalisation et la
          gestion des plateformes.
        </p>
      </div>
    </section>
  );
};

export default FollowCollection;
