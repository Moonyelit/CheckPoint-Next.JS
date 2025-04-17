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
        <div className="content">
          {/* Ajoutez ici le contenu de votre section */}
        </div>
      </section>
    </div>
  );
};

export default NewFunctionality;
