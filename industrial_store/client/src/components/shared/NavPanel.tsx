import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom'; // You might need to install react-router-dom for this
import Logo from  "../../assets/logo7.jpg"
const NavPanel: React.FC = () => {
    return (
        
            <nav className="bg-black h-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between ">
                
                    <img src={Logo} className='h-16 w-auto' alt="Logo" />
                  
                    <button className="text-white hover:text-gray-300 flex flex-col items-center focus:outline-none">
                      <MenuIcon style={{ fontSize: 28 }} />
                      <span className="text-xs sm:text-sm">Каталог</span>
                    </button>
           
            <div className="flex items-center space-x-6">
              <div className="relative mr-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon style={{ fontSize: 28 }} className="cursor-pointer" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2 rounded-full bg-gray-200 text-black"
                  placeholder="Поиск..."
                />
              </div>
              <Link to='/cart' className='no-underline'>
                <button className="text-white hover:text-gray-300 flex flex-col items-center focus:outline-none">
                  <ShoppingCartIcon style={{ fontSize: 28 }} />
                  <span className="text-xs sm:text-sm">Корзина</span>
                </button>
              </Link>
              <Link to='/login' className='no-underline'>
                <button className="text-white hover:text-gray-300 flex flex-col items-center focus:outline-none">
                  <AccountCircleIcon style={{ fontSize: 28 }} />
                  <span className="text-xs sm:text-sm">Аккаунт</span>
                </button>
              </Link>
              <Link to='about-us' className='no-underline'>
                <button className="text-white hover:text-gray-300 flex flex-col items-center focus:outline-none">
                  <InfoIcon style={{ fontSize: 28 }} />
                  <span className="text-xs sm:text-sm">О нас</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  
  export default NavPanel;