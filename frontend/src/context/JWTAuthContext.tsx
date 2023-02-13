import { createContext, useEffect, useReducer, useRef } from 'react'
import axiosInstance from '../services/axios'
import { validateToken } from '../utils/jwt'
import { resetSession, setSession } from '../utils/session'

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
}

export const AuthContext = createContext({
  ...initialState,
  login: (username: string, password: string) => Promise.resolve(),
  logout: () => Promise.resolve(),
})

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    }
  },
  LOGIN: (state, action) => {
    const { user } = action.payload

    return {
      ...state,
      isAuthenticated: true,
      user,
    }
  },
  LOGOUT: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    }
  },
}

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state

type AuthProviderType = {
  children: any
}

export const AuthProvider = ({ children }: AuthProviderType) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) return
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken && validateToken(accessToken)) {
          setSession(accessToken)

          const response = await axiosInstance.get('/users/me')
          const { data: user } = response
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          })
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          })
        }
      } catch (error) {
        console.error(error)
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        })
      }
    }
    initialize()
    isMounted.current = true
  }, [])

  const getTokens = async (username: string, password: string) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    const response = await axiosInstance.post('/auth/login', formData)
    setSession(response.data.access_token, response.data.refresh_token)
  }

  const login = async (username: string, password: string) => {
    try {
      await getTokens(username, password)
      const response = await axiosInstance.get('/users/me')
      const { data: user } = response
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      })
    } catch (err) {
      return Promise.reject(err)
    }
  }

  const logout = () => {
    resetSession()
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
