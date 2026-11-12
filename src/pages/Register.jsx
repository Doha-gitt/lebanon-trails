import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FormError, FormField, inputClass } from '../components/FormField'

export default function Register() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  // Page to return to after logging in, passed along from the Login page
  const from = useLocation().state?.from

  const handleChange = (e) => {
    // Clear error dynamically as the user types
    if (error) setError('')
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = (e) => {
    e.preventDefault()

    // Always clear existing errors at the start of submission
    setError('')

    const { name, email, password, confirmPassword } = formData

    // 1. Check for empty fields
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.')
      return
    }

    // 2. Email format validation check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    // 3. Password match check
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // 4. Password length check
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    // 5. Add the account to the mock users (fails if the email is taken)
    if (!register({ name, email, password })) {
      setError('An account with this email already exists. Log in instead.')
      return
    }

    // The Login page shows a confirmation and fills in the email
    navigate('/login', { state: { registeredEmail: email.trim(), from } })
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="surface w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="display-md">Create your account</h1>
          <p className="mt-1 text-sm opacity-80">Create an account to organize and join group hikes</p>
        </div>

        <FormError message={error} />

        <form onSubmit={handleRegister} noValidate className="space-y-4">
          <FormField id="register-name" label="Full name">
            <input
              id="register-name"
              type="text"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>
          <FormField id="register-email" label="Email address">
            <input
              id="register-email"
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="user@example.com"
            />
          </FormField>
          <FormField id="register-password" label="Password" hint="At least 6 characters">
            <input
              id="register-password"
              type="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>
          <FormField id="register-confirm" label="Confirm password">
            <input
              id="register-confirm"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>

          <button type="submit" className="btn btn-primary w-full">
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold underline underline-offset-4">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}
