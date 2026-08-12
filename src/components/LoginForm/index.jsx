import {useState} from 'react'
import {useNavigate, Navigate} from 'react-router'
import Cookies from 'js-cookie'

import './index.css'

const LoginForm = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const onChangeUsername = event => {
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    navigate('/', {replace: true})
  }

  const onSubmitFailure = message => {
    setShowSubmitError(true)
    setErrorMsg(message)
  }

  const submitForm = async event => {
    event.preventDefault()
    setShowSubmitError(false)
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        onSubmitSuccess(data.jwt_token)
      } else {
        onSubmitFailure(data.error_msg)
      }
    } catch (error) {
      onSubmitFailure('Something went wrong. Please try again.')
    }
  }

  // Already logged in? Skip the login screen.
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <form className="login-form" onSubmit={submitForm}>
          <img
            src="https://res.cloudinary.com/dppqkea7f/image/upload/v1625742512/Frame_274_zlrzwk.svg"
            alt="website logo"
            className="login-logo"
          />
          <h1 className="brand-heading">Tasty Kitchens</h1>
          <h1 className="login-heading">Login</h1>

          <label htmlFor="username" className="login-label">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            className="login-input"
            placeholder="rahul"
            value={username}
            onChange={onChangeUsername}
          />

          <label htmlFor="password" className="login-label">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            className="login-input"
            placeholder="rahul@2021"
            value={password}
            onChange={onChangePassword}
          />

          <button type="submit" className="login-submit-btn">
            Login
          </button>
          {showSubmitError && <p className="login-error">*{errorMsg}</p>}
        </form>
      </div>
      <div className="login-image-container">
        <img
          src="https://res.cloudinary.com/dppqkea7f/image/upload/v1625809830/login-image_duk4fw.png"
          alt="website login"
          className="login-image"
        />
      </div>
    </div>
  )
}

export default LoginForm
