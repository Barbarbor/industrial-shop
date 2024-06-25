
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { lazy } from 'react';
// const SupplyPage = lazy(()=> import('@/pages/SupplyPage') )
// const CategoryPage = lazy(()=> import('@/pages/Page') )
// const ProductPage = lazy(()=> import('@/pages/ProductPage') )
// const ManufacturerPage = lazy(()=> import('@/pages/ManufacturerPage') )
// const SupplierPage = lazy(()=> import('@/pages/SupplierPage') )
// const BuyerPage = lazy(()=> import('@/pages/BuyerPage') )
// const SellerPage = lazy(()=> import('@/pages/SellerPage') )
// const SalePage = lazy(()=> import('@/pages/SalePage') )
// const SchedulePage = lazy(()=> import('@/pages/SchedulePage') )
// const SalaryPage = lazy(()=> import('@/pages/SalaryPage') )
// const NavigationPage = lazy(()=> import('@/pages/NavigationPage') )
import SupplyPage from './pages/SupplyPage';
import CategoryPage from '@/pages/CategoryPage';
import ProductPage from '@/pages/ProductPage';
import ManufacturerPage from '@/pages/ManufacturerPage';
import SupplierPage from '@/pages/SupplierPage';
import BuyerPage from '@/pages/BuyerPage';
import SellerPage from '@/pages/SellerPage';
import SalePage from '@/pages/SalePage';
import SchedulePage from '@/pages/SchedulePage';
import SalaryPage from '@/pages/SalaryPage';
import NavigationPage from '@/pages/NavigationPage';
import NavPanel from './components/shared/NavPanel';
const AppRouter = () => {
   
    return (
        <BrowserRouter>
        <NavPanel/>
          <Routes>
            <Route path='/categories' element={<CategoryPage/>}/>
            <Route path='/products' element={<ProductPage/>}/>
            <Route path='/supplies' element={<SupplyPage/>}/>
            <Route path='/manufacturers' element={<ManufacturerPage/>}/>
            <Route path='/suppliers' element={<SupplierPage/>}/>
            <Route path='/buyers' element = {<BuyerPage/>}/>
            <Route path='/sellers' element = {<SellerPage/>}/>
            <Route path='/sales' element = {<SalePage/>}/>
            <Route path='/schedules' element = {<SchedulePage/>}/>
            <Route path='/salaries' element ={<SalaryPage/>}/>
            <Route path='/' element={<NavigationPage/>}/>
          </Routes>
        </BrowserRouter>

    )
}

export default AppRouter;