import React from 'react';
import { ICartProduct, IProduct } from '../../types/Product.types';


interface CartProductCardProps {
  product: IProduct;
  quantity: number;
}

const CartProductCard: React.FC<CartProductCardProps> = ({ product,quantity}) => {
  const { name, price, imageUrl } = product

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src={imageUrl} alt={name} className="w-24 h-24 object-contain mr-4" />
          <div>
            <h2 className="text-gray-800 text-lg font-semibold">{name}</h2>
            <p className="text-gray-600">${price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-l focus:outline-none"
           
          >
            -
          </button>
          <span className="px-3">{quantity}</span>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-r focus:outline-none"
            
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
