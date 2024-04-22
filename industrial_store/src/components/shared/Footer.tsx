import React from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link } from 'react-router-dom'; // You might need to install react-router-dom for this

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Контакты</h2>
            <div className="flex items-center mb-2">
              <EmailIcon />
              <span className="ml-2">example@gmail.com</span>
            </div>
            <div className="flex items-center">
              <PhoneIcon />
              <span className="ml-2">+79999999999</span>
            </div>
            <form className="mt-4">
              {/* Contact form fields go here */}
            </form>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Ссылки</h2>
            <ul>
              <li>
                <Link to="/about-us" className="block mb-2">О нас</Link>
              </li>
              <li>
                <Link to="/faq" className="block mb-2">FAQ</Link>
              </li>
             
              {/* Add more links as needed */}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Следите за нами</h2>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookIcon />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterIcon />
              </a>
              {/* Add more social media icons as needed */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
