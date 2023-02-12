import jwtDecode, { JwtPayload } from 'jwt-decode'

export const validateToken = (token: string): boolean => {
  const now = Math.round(new Date().getTime() / 1000)

  const decodedToken = jwtDecode<JwtPayload>(token)
  if (decodedToken.exp === undefined) {
    return false
  }

  return decodedToken && now < decodedToken.exp
}
