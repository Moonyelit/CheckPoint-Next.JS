import Image from "next/image";
import "./NewFunctionality.scss";

const NewFunctionality = () => {
  return (
    <div className="NewFunctionalityWrapper">
      <section className="NewFunctionality" aria-label="Nouvelles fonctionnalités à venir">
        <Image
          src="/images/NoLogin/BackgroundMore.png"
          alt=""
          fill
          className="background-image"
          priority
          aria-hidden="true"
        />
        <div className="contentNewFunctionality main-container">
          <h2 className="Title2-Karantina">Et ce n&apos;est que le début !</h2>

          <div className="Paragraphe1">
            <p>De nouvelles fonctionnalités sont prévues :</p>

            <ul className="custom-list" role="list" aria-label="Liste des nouvelles fonctionnalités">
              <li role="listitem">
                <Image
                  src="/images/Icons/svg/Playstation Icons.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="list-icon"
                  aria-hidden="true"
                />
                <span>Importez votre progression via les networks pour suivre vos jeux
                et statistiques en temps réel.</span>
              </li>
              <li role="listitem">
                <Image
                  src="/images/Icons/svg/Playstation Icons.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="list-icon"
                  aria-hidden="true"
                />
                <span>Ajoutez vos amis et créez une communauté autour de votre
                passion.</span>
              </li>
            </ul>

            <p className="Paragraphe1">
              Inscrivez-vous dès maintenant pour gérer votre progression et
              profiter d&apos;un site en constante évolution, avec de nombreuses
              nouveautés à venir.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewFunctionality;
