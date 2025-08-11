"use client"

import { useEffect, useContext } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AuthContext } from "../utils/AuthContext"
import apiService from "../utils/api"
import LoadingSpinner from "../components/LoadingSpinner"

const AuthSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)

  useEffect(() => {
    const handleAuthSuccess = async () => {
      const token = searchParams.get("token")

      if (token) {
        try {
          apiService.setToken(token)
          const response = await apiService.getCurrentUser()
          setUser(response.user)
          navigate("/")
        } catch (error) {
          console.error("Auth success error:", error)
          navigate("/login?error=auth_failed")
        }
      } else {
        navigate("/login?error=no_token")
      }
    }

    handleAuthSuccess()
  }, [searchParams, navigate, setUser])

  return <LoadingSpinner />
}

export default AuthSuccess
