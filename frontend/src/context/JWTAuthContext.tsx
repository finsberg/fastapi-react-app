import { createContext, useEffect, useReducer, useRef } from 'react'
import axiosInstance from '../services/axios'
import { validateToken } from '../utils/jwt'
import { resetSession, setSession } from '../utils/session'
import { LoginUserType } from '../components/Auth/UserType.types'

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
}

type StateType = {
  isAuthenticated: boolean
  isInitialized: boolean
  user: LoginUserType
}

type ActionInitialize = { type: 'INITIALIZE'; payload: any }
type ActionLogin = { type: 'LOGIN'; payload: any }
type ActionLogout = { type: 'LOGOUT' }

type ActionType = ActionInitialize | ActionLogin | ActionLogout

export const AuthContext = createContext({
  ...initialState,
  login: (username: string, password: string) => Promise.resolve(),
  logout: () => Promise.resolve(),
  reset: () => Promise.resolve(),
})

const handlers = {
  INITIALIZE: (state: StateType, action: ActionInitialize) => {
    const { isAuthenticated, user } = action.payload

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    }
  },
  LOGIN: (state: StateType, action: ActionLogin) => {
    const { user } = action.payload

    return {
      ...state,
      isAuthenticated: true,
      user,
    }
  },
  LOGOUT: (state: StateType) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    }
  },
}

const reducer = (state: StateType, action: ActionType) =>
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

  const reset = async () => {
    try {
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
        reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
