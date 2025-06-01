import "./styles/Footer.scss";
import '../../styles/globals.scss';
import classNames from 'classnames';

const Footer = () => {
  return (
    <footer className={classNames("footer", 'Paragraphe1')}>
      <div className="footerContent">
        <ul className="footerLinks">
          <li>Contact</li>
          <li>|</li>
          <li>L&apos;équipe</li>
          <li>|</li>
          <li>Informations légales</li>
          <li>|</li>
          <li>Politique de confidentialité</li>
        </ul>
        <div className="copyright">
          <li>© 2025 CheckPoint v.1.0 </li>
          <li>|</li>
          <li>Game database powered by IGDB</li>
        </div>
      </div>
    </footer>
  );
};

export default Footer;