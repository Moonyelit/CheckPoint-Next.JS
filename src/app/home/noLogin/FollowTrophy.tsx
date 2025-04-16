import Image from "next/image";
import "./FollowTrophy.css";

const FollowTrophy = () => {
  return (
    <section className="followTrophy">
      <div className="TitleStyle">
        <div className="shapeLeft">
          <h2 className="Title2-Karantina titleTrophy">
            Relève des défis et prouve ta valeur !
          </h2>
        </div>
        <div className="shapeRight">
          <div className="stripe stripe1"></div>
          <div className="stripe stripe2"></div>
        </div>
      </div>

      <div className="trophyInfos Paragraphe1">
        <div className="trophyParagraph">
        <p>
          Crée tes propres défis et partage-les avec la communauté. Affronte
          d’autres joueurs, teste de nouvelles façons de jouer et prouve ton
          talent.
        </p>

        <p>
          Chaque défi est une opportunité de redécouvrir tes jeux et de
          repousser tes propres records !
        </p>
        </div>
        <Image
          src="/images/NoLogin/Trophy.png"
          alt="Trophy"
          width={600}
          height={500}
          className="trophyImage"
        />
        <div></div>
      </div>
    </section>
  );
};

export default FollowTrophy;
