import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FormError, FormField, inputClass } from '../components/FormField'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // Set by the Register page after a new account is created
  const registeredEmail = location.state?.registeredEmail
  // Set by RequireAuth (or the join button) when a page needs an account first
  const from = location.state?.from

  const [email, setEmail] = useState(registeredEmail ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleChangeEmail = (e) => {
    if (error) setError('')
    setEmail(e.target.value)
  }

  const handleChangePassword = (e) => {
    if (error) setError('')
    setPassword(e.target.value)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    // Check the email and password against the mock user accounts
    if (!login(email, password)) {
      setError('Email or password is incorrect.')
      return
    }

    navigate(from ?? '/trails', { replace: Boolean(from) })
  }

  return (
    <div className="mx-auto mt-12 max-w-md rounded-lg border border-ink/15 p-8 dark:border-stone/20">
      <h1 className="mb-6 text-center text-3xl font-bold">Log in to Lebanon Trails</h1>

      {registeredEmail && !error && (
        <p role="status" className="mb-5 rounded border border-olive/40 bg-olive/10 px-4 py-3">
          Your account is ready. Log in with your new password.
        </p>
      )}
      {from && !registeredEmail && !error && (
        <p role="status" className="mb-5 rounded border border-olive/40 bg-olive/10 px-4 py-3">
          Please log in to continue.
        </p>
      )}
      <FormError message={error} />

      <form onSubmit={handleLogin} noValidate className="space-y-4">
        <FormField id="login-email" label="Email address">
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={handleChangeEmail}
            className={inputClass}
            placeholder="user@example.com"
          />
        </FormField>
        <FormField id="login-password" label="Password">
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={handleChangePassword}
            className={inputClass}
          />
        </FormField>
        <button type="submit" className="w-full rounded bg-brand py-2.5 font-semibold text-paper hover:opacity-90">
          Log in
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" state={{ from }} className="font-semibold underline underline-offset-4">
          Register here
        </Link>
      </p>
      <p className="mt-2 text-center text-sm opacity-75">Demo account: doha@example.com, password trails123</p>
    </div>
  )
}
