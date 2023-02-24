import { Flex, Spinner } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { Authenticated } from './components/Auth/Authenticated'
import { Login } from './components/Auth/Login'
import { PublicRoute } from './components/Auth/PublicRoute'
import { Register } from './components/Auth/Register'
import { SidebarWithHeader } from './components/Sidebar/Sidebar'
import { TodoDetail } from './components/Todo/TodoDetail'
import { TodoList } from './components/Todo/TodoList'
import { AuthConsumer, AuthProvider } from './context/JWTAuthContext'
import { UserProfile } from './components/User/Profile'
import { Home } from './components/Home/Home'
import { Users } from './components/User/Users'

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <AuthConsumer>
            {(auth) =>
              !auth.isInitialized ? (
                <Flex
                  height="100vh"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="green.200"
                    color="green.500"
                    size="xl"
                  />
                </Flex>
              ) : (
                <Routes>
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <Authenticated>
                        <Home />
                      </Authenticated>
                    }
                  />

                  <Route
                    path="/todo"
                    element={
                      <Authenticated>
                        <SidebarWithHeader>
                          <TodoList />
                        </SidebarWithHeader>
                      </Authenticated>
                    }
                  />
                  <Route
                    path="/todo/:id"
                    element={
                      <Authenticated>
                        <SidebarWithHeader>
                          <TodoDetail />
                        </SidebarWithHeader>
                      </Authenticated>
                    }
                  />
                  <Route
                    path="/user"
                    element={
                      <Authenticated>
                        <SidebarWithHeader>
                          <UserProfile />
                        </SidebarWithHeader>
                      </Authenticated>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <Authenticated>
                        <SidebarWithHeader>
                          <Users />
                        </SidebarWithHeader>
                      </Authenticated>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              )
            }
          </AuthConsumer>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
