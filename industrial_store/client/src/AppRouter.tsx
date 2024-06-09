
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SupplyPage from '@/pages/SupplyPage';
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
const AppRouter = () => {
   
    return (
        <BrowserRouter>
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