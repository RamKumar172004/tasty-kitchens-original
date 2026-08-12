import {useState, useEffect, useCallback} from 'react'
import {Link} from 'react-router'
import Cookies from 'js-cookie'
import {Oval} from 'react-loader-spinner'
import Slider from 'react-slick'
import {FaStar, FaChevronLeft, FaChevronRight} from 'react-icons/fa'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import {sortByOptions} from '../../App'
import Header from '../Header'
import RestaurantsHeader from '../RestaurantsHeader'
import Footer from '../Footer'
import SomethingWentWrong from '../SomethingWentWrong'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const LIMIT = 9
const TOTAL_PAGES = 4

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3500,
  arrows: false,
}

const Home = () => {
  const [offersList, setOffersList] = useState([])
  const [offersStatus, setOffersStatus] = useState(apiStatusConstants.initial)

  const [restaurantsList, setRestaurantsList] = useState([])
  const [restaurantsStatus, setRestaurantsStatus] = useState(
    apiStatusConstants.initial,
  )
  const [activePage, setActivePage] = useState(1)
  const [activeOptionId, setActiveOptionId] = useState(sortByOptions.lowest)

  useEffect(() => {
    const getOffers = async () => {
      setOffersStatus(apiStatusConstants.inProgress)
      const jwtToken = Cookies.get('jwt_token')
      const url = 'https://apis.ccbp.in/restaurants-list/offers'
      const options = {
        headers: {Authorization: `Bearer ${jwtToken}`},
        method: 'GET',
      }
      try {
        const response = await fetch(url, options)
        if (response.ok) {
          const data = await response.json()
          const updatedOffers = data.offers.map(offer => ({
            id: offer.id,
            imageUrl: offer.image_url,
          }))
          setOffersList(updatedOffers)
          setOffersStatus(apiStatusConstants.success)
        } else {
          setOffersStatus(apiStatusConstants.failure)
        }
      } catch (error) {
        setOffersStatus(apiStatusConstants.failure)
      }
    }
    getOffers()
  }, [])

  const getRestaurantsList = useCallback(async () => {
    setRestaurantsStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const offset = (activePage - 1) * LIMIT
    const url = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${LIMIT}&sort_by_rating=${activeOptionId}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const updatedRestaurants = data.restaurants.map(restaurant => ({
          id: restaurant.id,
          name: restaurant.name,
          imageUrl: restaurant.image_url,
          cuisine: restaurant.cuisine,
          rating: restaurant.user_rating.rating,
          totalReviews: restaurant.user_rating.total_reviews,
        }))
        setRestaurantsList(updatedRestaurants)
        setRestaurantsStatus(apiStatusConstants.success)
      } else {
        setRestaurantsStatus(apiStatusConstants.failure)
      }
    } catch (error) {
      setRestaurantsStatus(apiStatusConstants.failure)
    }
  }, [activePage, activeOptionId])

  useEffect(() => {
    getRestaurantsList()
  }, [getRestaurantsList])

  const updateActiveOptionId = newActiveOptionId => {
    setActiveOptionId(newActiveOptionId)
    setActivePage(1)
  }

  const onClickLeftPage = () => {
    setActivePage(prevActivePage =>
      prevActivePage > 1 ? prevActivePage - 1 : 1,
    )
  }

  const onClickRightPage = () => {
    setActivePage(prevActivePage =>
      prevActivePage < TOTAL_PAGES ? prevActivePage + 1 : TOTAL_PAGES,
    )
  }

  const renderOffers = () => {
    switch (offersStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" testid="restaurants-offers-loader">
            <Oval visible height={40} width={50} color="gold" ariaLabel="loading" />
          </div>
        )
      case apiStatusConstants.success:
        return (
          <div className="offers-carousel-container">
            <Slider {...sliderSettings}>
              {offersList.map(offer => (
                <div className="offer-slide" key={offer.id}>
                  <img className="offer-img" src={offer.imageUrl} alt="offer" />
                </div>
              ))}
            </Slider>
          </div>
        )
      default:
        return null
    }
  }

  const renderRestaurantsList = () => (
    <>
      <RestaurantsHeader
        activeOptionId={activeOptionId}
        updateActiveOptionId={updateActiveOptionId}
      />
      <div className="restaurants-list-container">
        <ul className="restaurants-items-container">
          {restaurantsList.map(restaurant => (
            <li key={restaurant.id}>
              <Link
                to={`/restaurant/${restaurant.id}`}
                className="restaurant-item-link"
              >
                <div className="restaurant-item-container" testid="restaurant-item">
                  <img
                    src={restaurant.imageUrl}
                    alt="restaurant"
                    className="restaurant-item-img"
                  />
                  <h1 className="restaurant-item-name">{restaurant.name}</h1>
                  <p className="restaurant-item-cuisine">
                    {restaurant.cuisine}
                  </p>
                  <div className="restaurant-item-rating-container">
                    <FaStar className="star-icon" />
                    <p className="rating-value">{restaurant.rating}</p>
                    <p className="total-ratings-value">
                      ({restaurant.totalReviews})
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="pagination-container">
          <button
            type="button"
            testid="pagination-left-button"
            className="pagination-btn"
            onClick={onClickLeftPage}
          >
            <FaChevronLeft />
          </button>
          <p className="page-count-text">
            <span testid="active-page-number">{activePage}</span> of{' '}
            {TOTAL_PAGES}
          </p>
          <button
            type="button"
            testid="pagination-right-button"
            className="pagination-btn"
            onClick={onClickRightPage}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </>
  )

  const renderRestaurants = () => {
    switch (restaurantsStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" testid="restaurants-list-loader">
            <Oval visible height={40} width={50} color="gold" ariaLabel="loading" />
          </div>
        )
      case apiStatusConstants.success:
        return renderRestaurantsList()
      case apiStatusConstants.failure:
        return <SomethingWentWrong onRetry={getRestaurantsList} />
      default:
        return null
    }
  }

  return (
    <div className="home-container">
      <Header />
      {renderOffers()}
      {renderRestaurants()}
      <Footer />
    </div>
  )
}

export default Home
