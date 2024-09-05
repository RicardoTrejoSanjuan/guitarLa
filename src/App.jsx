import Header from './components/Header';
import Guitar from './components/Guitar';
import { useState, useEffect } from 'react';
import { db } from './data/db';

function App() {

   const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : []
   }

  // State
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);
  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {
    const guitarExist = cart.findIndex(element => element.id === item.id);

    if (guitarExist >= 0) {
      if (cart[guitarExist].quantity >= MAX_ITEMS) return;
      const updateCart = [...cart];
      updateCart[guitarExist].quantity++;
      setCart(updateCart);
    } else {
      item.quantity = 1;
      setCart(prevCart => [...prevCart, item]);
    }
  }

  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
  }

  function increaseQuantity(id) {
    const updateCart = cart.map(item => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1
        };
      }
      return item;
    });
    setCart(updateCart);
  }

  function decreaseQuantity(id) {
    const updateCart = cart.map(item => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1
        };
      }
      return item;
    });
    setCart(updateCart);
  }

  function emptyCart() {
    setCart([]);
  }

  return (
    <>
      <Header 
        cart={cart}
        removeFromCart={removeFromCart}
        decreaseQuantity={decreaseQuantity}
        increaseQuantity={increaseQuantity}
        emptyCart={emptyCart} />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {
            data.map((guitar) => (
              <Guitar
                guitar={guitar}
                setCart={setCart}
                addToCart={addToCart}
                key={guitar.id} />
            ))
          }
        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>
    </>
  )
}

export default App
