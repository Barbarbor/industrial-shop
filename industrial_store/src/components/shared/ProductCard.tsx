import React from 'react';

import { IProduct } from '../../types/Product.types'
import { useNavigate } from 'react-router-dom';
interface ProductCardProps {
  product: IProduct;
  withButton?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ product,withButton=true}) => {
  const { name, price, imageUrl } = product;
  const navigate = useNavigate();  
  const handleNavigationByClick = () =>{
    navigate(`/product/${product.id}`);
}
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer" onClick={handleNavigationByClick}>
      <img src={imageUrl} alt={name} className="w-full h-64 object-contain object-center" />
      <div className="p-4">
        <h2 className="text-gray-800 text-lg font-semibold">{name}</h2>
        <p className="text-gray-600 mt-2">₽{price.toFixed(2)}</p>
        <div onClick={ (e)=>e.stopPropagation()}>
    { withButton? (<button
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
         
        >
          Добавить в корзину
        </button>): (null)}
        
       
        </div>
      </div>
    </div>
  );
};

export default ProductCard;