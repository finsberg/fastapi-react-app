import { createContext, useEffect, useReducer, useRef } from 'react'
import axiosInstance from '../services/axios'
import { validateToken } from '../utils/jwt'
import { resetSession, setSession } from '../utils/session'

type UserProps = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  id: string
  is_admin: boolean
}

type StateType = {
  user: UserProps | null
  isAuthenticated?: boolean
  isInitialized?: boolean
}

const initialState: StateType = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
}

type ActionInitialize = { type: 'INITIALIZE'; payload: StateType }
type ActionLogin = { type: 'LOGIN'; payload: StateType }
type ActionLogout = { type: 'LOGOUT' }

type ActionType = ActionInitialize | ActionLogin | ActionLogout

export const AuthContext = createContext({
  ...initialState,
  login: (username: string, password: string) => Promise.resolve(),
  logout: () => Promise.resolve(),
  reset: () => Promise.resolve(),
})

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'INITIALIZE': {
      const { isAuthenticated, user } = action.payload

      return {
        ...state,
        isAuthenticated,
        isInitialized: true,
        user,
      }
    }
    case 'LOGIN': {
      const { user } = action.payload

      return {
        ...state,
        isAuthenticated: true,
        user,
      }
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      }
    }
    default: {
      return state
    }
  }
}

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
              ...state,
              isAuthenticated: true,
              user,
            },
          })
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              ...state,
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
            ...state,
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

  const login = async (username: string, password: string): Promise<void> => {
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

  const reset = async (): Promise<void> => {
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

  const logout = async (): Promise<void> => {
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
