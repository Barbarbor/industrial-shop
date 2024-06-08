import { ICartProduct } from "../../types/Product.types"
import CartProductCard from "../shared/CartProductCard"
import OrderCard from "../shared/OrderCard";
const generateCartProducts = (count: number): ICartProduct[] => {
    const cartProducts: ICartProduct[] = [];
    for (let i = 1; i <= count; i++) {
      cartProducts.push({
        id: i,
        product: {
          id: i,
          name: `Product ${i}`,
          price: Math.floor(Math.random() * 100) + 1,
          imageUrl: `http://localhost:5173/media/shampoo.jpeg`, 
        },
        quantity: Math.floor(Math.random() * 5) + 1, 
      });
    }
    return cartProducts;
  };
  
  const CartPage: React.FC = () => {
    const cartProducts = generateCartProducts(10);
  
    return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold mb-4">Корзина товаров</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {cartProducts.map((cartProduct) => (
                <CartProductCard  key={cartProduct.id} {...cartProduct} />
              ))}
            </div>
            <div>
              <OrderCard cartProducts={cartProducts} />
            </div>
          </div>
        </div>
      );
  };
  
  export default CartPage;
  