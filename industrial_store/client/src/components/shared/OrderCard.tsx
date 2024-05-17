import React from 'react';
import { ICartProduct } from '../../types/Product.types';

interface OrderCardProps {
  cartProducts: ICartProduct[];
}

const OrderCard: React.FC<OrderCardProps> = ({ cartProducts }) => {
  // Calculate total amount
  const totalAmount = cartProducts.reduce((total, cartProduct) => {
    return total + cartProduct.product.price * cartProduct.quantity;
  }, 0);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Заказ</h2>
      <div className="flex justify-between items-center mb-4">
        <span>Сумма заказа:</span>
        <span className="font-bold">₽{totalAmount.toFixed(2)}</span>
      </div>
      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
        Оформить заказ
      </button>
    </div>
  );
};

export default OrderCard;
