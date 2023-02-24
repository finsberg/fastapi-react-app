import { useEffect, useState, useRef } from 'react'
import axiosInstance from '../../services/axios'
import { LoginUserType } from '../../components/Auth/UserType.types'

export function Users() {
  const [users, setUsers] = useState<LoginUserType[]>([])
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) return
    const initialize = async () => {
      const response = await axiosInstance.get('/users/me')
    }
    initialize()
  })

  return <h4>Users</h4>
}
