import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { LoginForm } from "@/components/auth/signin-form"

export default function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/dashboard"

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true)
      setError(null)

      await login(email, password)

      navigate(from, { replace: true })
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}