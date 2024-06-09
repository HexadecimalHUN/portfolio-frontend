import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className="border-t border-slate-400 flex flex-col items-center justify-center text-slate-400 pt-4 pb-4 bottom-0">
      <div className="flex flex-row justify-center gap-2">
      <a href="https://www.facebook.com/HadaPhotography" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faFacebook} className="text-4xl m-2 hover:text-blue-700 transform duration-200"/>
      </a>
      <a href="https://www.instagram.com/hadakaroly_portrait_photo/" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faInstagram} className="text-4xl m-2 hover:text-purple-800 transform duration-200" />
      </a>
      </div>
      <div className="flex justify-center flex-col  items-center">
        <h1>Karoly Hada Photography {new Date().getFullYear()} | All Rights Reserved</h1>
        <h1 className="text-sm">Made by Hexa with ❤️</h1>
      </div>
    </div>
  );
};

export default Footer;