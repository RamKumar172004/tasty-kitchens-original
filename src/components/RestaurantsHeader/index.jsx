import {BsFilterLeft} from 'react-icons/bs'

import {sortByOptions} from '../../App'
import './index.css'

const RestaurantsHeader = ({activeOptionId, updateActiveOptionId}) => {
  const onChangeSortBy = event => {
    updateActiveOptionId(event.target.value)
  }

  return (
    <div className="restaurants-header">
      <div className="restaurants-header-text">
        <h1 className="restaurants-heading">Popular Restaurants</h1>
        <p className="restaurants-subheading">
          Select your favourite restaurant special dish and make your day
          happy...
        </p>
      </div>

      <div className="sort-by-container">
        <BsFilterLeft className="sort-by-icon" />
        <select
          className="sort-by-select"
          value={activeOptionId}
          onChange={onChangeSortBy}
        >
          <option value={sortByOptions.lowest}>Lowest</option>
          <option value={sortByOptions.highest}>Highest</option>
        </select>
      </div>
    </div>
  )
}

export default RestaurantsHeader
