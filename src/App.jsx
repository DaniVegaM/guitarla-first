import { useState, useEffect } from 'react'
import Header from './components/Header'
import Guitar from './components/Guitar'
import { db } from './data/db.js'

function App() {
  //NOTA: Para un caso real de consumir un API usariamos useEffect para que consumamos el api una vez cargado el componente
  //Y posteriormente ya con setData seteamos el resultado de consumir el api

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)
  const MAX_ITEMS = 5

   //NOTA: El state en React es asincrono, lo que significa que si lees el valor del state inmediatamente despues de usar "setState" podrías
  //Obtener un valor anterior, para leerlo 
  useEffect(() =>{
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  //IMPORTANTE: No confundir useState como los datos de la DB real, todo esto es frontend unicamente, aún es neceario en un. caso real,
  //mandar los datos a la DB

  function addToCart(item){
    const itemExists = cart.findIndex(existingItem => existingItem.id == item.id)
    if(itemExists >= 0){
      if(cart[itemExists].quantity >= MAX_ITEMS) return
      const currentCart = [...cart]
      currentCart[itemExists].quantity++ //NOTA: Es necesario sacar copia del state y luego hacer el set para no mutarlo con ++
      setCart(currentCart)
    } else{
      item.quantity = 1
      setCart([...cart, item])
    }
  }

  function removeFromCart(id){
    setCart(prevCart => prevCart.filter(item => item.id !== id))
  }

  function increaseQuantity(id){
    setCart(prevCart => prevCart.map(item => item.id === id && item.quantity < MAX_ITEMS? {...item, quantity: item.quantity + 1} : item))
  }

  function decreaseQuantity(id){
    setCart(prevCart => prevCart.map(item => item.id === id && item.quantity > 1 ? {...item, quantity: item.quantity - 1} : item))
  }

  function clearCart(){
    setCart([])
  }

  return (
    <>
      <Header 
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        {/*/NOTA: Para agregar dinamismo a cada guitarra que mostramos, lo haremos utilizando props*/}
        <div className="row mt-5">
          {data.map(guitar => ( //Este arrow function con parentesis significa que retorna un valor
            <Guitar 
              key={guitar.id} //Clave única para cada guitarra necesaria para funcionamiento de React
              guitar={guitar}
              addToCart={addToCart}
            />
          ))}
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
