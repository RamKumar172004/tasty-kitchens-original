import {useState} from 'react'
import {FaStar, FaRupeeSign} from 'react-icons/fa'
import {HiOutlineMinusSm} from 'react-icons/hi'
import {BsPlus} from 'react-icons/bs'

import './index.css'


const readCart = () => JSON.parse(localStorage.getItem('cartData')) || []

const writeCart = cartItems => {
  localStorage.setItem('cartData', JSON.stringify(cartItems))
}

const FoodItems = ({foodItem}) => {
  const [count, setCount] = useState(0)

  const syncCart = newCount => {
    const cartItems = readCart()
    const existingIndex = cartItems.findIndex(item => item.id === foodItem.id)

    if (newCount === 0) {
      writeCart(cartItems.filter(item => item.id !== foodItem.id))
      return
    }

    const updatedItem = {
      cost: foodItem.cost,
      quantity: newCount,
      id: foodItem.id,
      imageUrl: foodItem.imageUrl,
      name: foodItem.name,
    }

    if (existingIndex >= 0) {
      cartItems[existingIndex] = updatedItem
    } else {
      cartItems.push(updatedItem)
    }
    writeCart(cartItems)
  }

  const onIncrement = () => {
    const newCount = count + 1
    setCount(newCount)
    syncCart(newCount)
  }

  const onDecrement = () => {
    if (count > 0) {
      const newCount = count - 1
      setCount(newCount)
      syncCart(newCount)
    }
  }

  const onAdd = () => {
    const newCount = 1
    setCount(newCount)
    syncCart(newCount)
  }

  return (
    <li className="food-item-card" testid="foodItem">
      <img src={foodItem.imageUrl} alt="food item" className="food-item-img" />
      <div className="food-item-details">
        <h1 className="food-item-name">{foodItem.name}</h1>
        <div className="food-item-cost-container">
          <FaRupeeSign className="rupee-icon" />
          <p className="food-item-cost">{foodItem.cost}</p>
        </div>
        <div className="food-item-rating-container">
          <FaStar className="star-icon" />
          <p className="food-item-rating">{foodItem.rating}</p>
        </div>

        {count === 0 ? (
          <button type="button" className="add-btn" onClick={onAdd}>
            Add
          </button>
        ) : (
          <div className="food-item-counter-container">
            <button
              type="button"
              testid="decrement-count"
              className="counter-btn"
              onClick={onDecrement}
            >
              <HiOutlineMinusSm />
            </button>
            <p testid="active-count" className="counter-value">
              {count}
            </p>
            <button
              type="button"
              testid="increment-count"
              className="counter-btn"
              onClick={onIncrement}
            >
              <BsPlus />
            </button>
          </div>
        )}
      </div>
    </li>
  )
}

export default FoodItems
