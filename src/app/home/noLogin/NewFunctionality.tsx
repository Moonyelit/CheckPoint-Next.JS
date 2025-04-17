import Image from "next/image";
import "./NewFunctionality.css";

const NewFunctionality = () => {
  return (
    <div className="NewFunctionalityWrapper">
      <section className="NewFunctionality">
        <Image
          src="/images/NoLogin/BackgroundMore.png"
          alt="Background"
          fill
          className="background-image"
          priority
        />
        <div className="contentNewFunctionality">
          <h2 className="Title2-Karantina">Et ce n&apos;est que le début !</h2>

          <div className="Paragraphe1">
            <p>De nouvelles fonctionnalités sont prévues :</p>

            <ul className="custom-list">
              <li>
                <Image
                  src="/images/Icons/svg/Playstation Icons.svg"
                  alt="PlayStation Icon"
                  width={20}
                  height={20}
                  className="list-icon"
                />
                <span>Importez votre progression via les networks pour suivre vos jeux
                et statistiques en temps réel.</span>
              </li>
              <li>
                <Image
                  src="/images/Icons/svg/Playstation Icons.svg"
                  alt="PlayStation Icon"
                  width={20}
                  height={20}
                  className="list-icon"
                />
                <span>Ajoutez vos amis et créez une communauté autour de votre
                passion.</span>
              </li>
            </ul>

            <p>
              Inscrivez-vous dès maintenant pour gérer votre progression et
              profiter d’un site en constante évolution, avec de nombreuses
              nouveautés à venir.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewFunctionality;
