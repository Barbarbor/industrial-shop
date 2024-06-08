import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../shared/ProductCard'; 
import { IProductDetail } from '../../types/Product.types';

const products: IProductDetail[] = [
  {
    id: 1,
    name: "Product 1",
    price: 25.99,
    imageUrl: "http://localhost:5173/media/shampoo.jpeg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum urna sit amet nisi aliquet, vel rhoncus metus mattis.",
  },
  {
    id: 2,
    name: "Product 2",
    price: 19.99,
    imageUrl: "https://via.placeholder.com/300x200",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum urna sit amet nisi aliquet, vel rhoncus metus mattis.",
  },
  // Add more products as needed
];

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = products[0]
  const { name, price, imageUrl, description } = product;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ProductCard withButton={false} product={product} />
        </div>
        <div>
          <h1 className="text-3xl font-semibold mb-4">{name}</h1>
          <p className="text-gray-600 mb-4">₽{price.toFixed(2)}</p>
          <p className="text-gray-800 mb-4">{description}</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
