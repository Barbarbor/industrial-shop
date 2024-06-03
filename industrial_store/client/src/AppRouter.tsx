import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SupplyPage from './components/pages/SupplyPage';
import CategoryPage from './components/pages/CategoryPage';
import ProductPage from './components/pages/ProductPage';
import ManufacturerPage from './components/pages/ManufacturerPage';
import SupplierPage from './components/pages/SupplierPage';
import BuyerPage from './components/pages/BuyerPage';
import SellerPage from './components/pages/SellerPage';
import SalePage from './components/pages/SalePage';
import SchedulePage from './components/pages/SchedulePage';
import SalaryPage from './components/pages/SalaryPage';
const AppRouter = () => {
   
    return (
        <BrowserRouter>
          <Routes>
            <Route path='/categories' element={<CategoryPage/>}/>
            <Route path='/products' element={<ProductPage/>}/>
            <Route path='/supplies' element={<SupplyPage/>}/>
            <Route path ='/manufacturer' element={<ManufacturerPage/>}/>
            <Route path='/supplier' element={<SupplierPage/>}/>
            <Route path='/buyer' element = {<BuyerPage/>}/>
            <Route path='/seller' element = {<SellerPage/>}/>
            <Route path='/sale' element = {<SalePage/>}/>
            <Route path='/schedule' element = {<SchedulePage/>}/>
            <Route path='/salary' element ={<SalaryPage/>}/>
          </Routes>
        </BrowserRouter>

    )
}

export default AppRouter;