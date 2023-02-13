import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Input,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ThemeToggler } from '../Theme/ThemeToggler'
import { LoginUserType } from './UserType.types'

export const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserType>()
  const navigate = useNavigate()
  const { login } = useAuth()
  const toast = useToast()

  const onSubmit = async (values: LoginUserType) => {
    try {
      await login(values.username, values.password)
    } catch (error) {
      toast({
        title: 'Invalid username or password',
        status: 'error',
        isClosable: true,
        duration: 1500,
      })
    }
  }

  let usernameMessage = ''
  if (errors.username?.message !== undefined) {
    usernameMessage = errors.username.message.toString()
  }

  let passwordMessage = ''
  if (errors.password?.message !== undefined) {
    passwordMessage = errors.password.message.toString()
  }

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex
        direction="column"
        alignItems="center"
        background={useColorModeValue('gray.100', 'gray.700')}
        p={12}
        rounded={6}
      >
        <Heading mb={6}>Login</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={usernameMessage !== ''}>
            <Input
              placeholder="Username"
              background={useColorModeValue('gray.300', 'gray.600')}
              type="username"
              size="lg"
              mt={6}
              {...register('username', {
                required: 'This is required field',
              })}
            />
            <FormErrorMessage>{usernameMessage}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={passwordMessage !== ''}>
            <Input
              placeholder="Password"
              background={useColorModeValue('gray.300', 'gray.600')}
              type="password"
              size="lg"
              mt={6}
              {...register('password', {
                required: 'This is required field',
              })}
            />
            <FormErrorMessage>{passwordMessage}</FormErrorMessage>
          </FormControl>
          <Button
            isLoading={isSubmitting}
            loadingText="Logging in..."
            width="100%"
            colorScheme="green"
            variant="outline"
            mt={6}
            mb={6}
            type="submit"
          >
            Login
          </Button>
        </form>
        <ThemeToggler showLabel={true} />
        <Button
          onClick={() => navigate('/register', { replace: true })}
          width="100%"
          colorScheme="gray"
          variant="outline"
          mt={6}
        >
          Register Instead
        </Button>
      </Flex>
    </Flex>
  )
}
