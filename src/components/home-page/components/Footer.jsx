import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useState, useEffect } from "react"; 
import '../../app/shared-styles/App.css';

function Footer() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 1000);
  },[])

  return loading ? (
   <footer>
    <div className="about-project">
      <h2>
        <span>Zillo</span>
        <span>Cine</span>
      </h2>
      <div className="social-icons">
        <a href="https://github.com/888888b" target="_blank"><FaGithub className="icons github-icon"/></a>
        <a href="https://www.linkedin.com/in/vitor-hugo-2054622a6/" target="_blank"><FaLinkedin className='icons linkedin-icon'/></a>
        <a href="https://www.instagram.com/vitor_araujo621/" target="_blank"><FaInstagram className="icons instagram-icon"/></a>
      </div>
      <h2>Vitor Hugo</h2>
    </div>
   </footer> 
  ):null
}

export default Footer;