import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavPanel from './components/shared/NavPanel'
import Footer from './components/shared/Footer'

import MainPage from './components/pages/MainPage'
import CartPage from './components/pages/CartPage'
import ProductPage from './components/pages/ProductPage'
import AboutUsPage from './components/pages/AboutUsPage'

import LoginForm from './components/forms/LoginForm'
import RegistrationForm from './components/forms/RegisterForm'
const AppRouter = () => {
   
    return (
        <BrowserRouter>
            <NavPanel/>
            <Routes>
              <Route path='/' element={<MainPage/>}/>
              <Route path='/cart' element={<CartPage/>}/> 
              <Route path='/product/:productId' element={<ProductPage/>}/>
              <Route path='/register' element={<RegistrationForm/>}/>
              <Route path='/login' element={<LoginForm/>}/> 
              <Route path='/about-us' element={<AboutUsPage/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>

    )
}

export default AppRouter;