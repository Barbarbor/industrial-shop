import React, { useState } from 'react';
import ProductCard from '../shared/ProductCard';
import { IProduct } from '../../types/Product.types';
// Generate test products
const generateProducts = (count: number): IProduct[] => {
  const products: IProduct[] = [];
  for (let i = 1; i <= count; i++) {
    products.push({
      id: i,
      name: `Product ${i}`,
      price: Math.floor(Math.random() * 100) + 1, 
      imageUrl: `http://localhost:5173/media/shampoo.jpeg`,
    });
  }
  return products;
};

const MainPage: React.FC = () => {
  // Generate test products
  const products = generateProducts(4);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">Все продукты</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}  />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
