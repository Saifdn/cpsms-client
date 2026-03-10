import { SignupForm } from "@/components/auth/signup-form"
import { useNavigate } from "react-router-dom"
import axios from "@/api/axios"
import { toast } from "react-hot-toast"

export default function SignUp() {

  const navigate = useNavigate()

  const handleSignup = async ({ fullName, email, phone, password }) => {
    try {
      await axios.post("/auth/register", { fullName, email, phone, password })
      toast.success("Account created successfully! Please login.")
      navigate("/sign-in")
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Signup failed")
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm onSubmit={handleSignup}/>
      </div>
    </div>
  )
}
