import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../services/axios'
import axios from 'axios'
import { ThemeToggler } from '../Theme/ThemeToggler'
import { LoginUserType } from './UserType.types'

export const Register = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserType>()
  const navigate = useNavigate()
  const toast = useToast()

  const onSubmit = async (values: LoginUserType) => {
    try {
      await axiosInstance.post('/users/create', values)
      toast({
        title: 'Account created successfully.',
        status: 'success',
        isClosable: true,
        duration: 1500,
      })
      navigate('/login', { replace: true })
    } catch (err) {
      console.log(err)
      let message = 'An error occurred when trying to log in'
      if (axios.isAxiosError(err)) {
        message = err.response?.data.detail
      }
      toast({
        title: message,
        status: 'error',
        isClosable: true,
        duration: 1500,
      })
    }
  }
  let emailMessage = ''
  if (errors.email?.message !== undefined) {
    emailMessage = errors.email.message.toString()
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
        <Heading mb={6}>Register</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={emailMessage !== ''}>
            <Input
              placeholder="Email"
              background={useColorModeValue('gray.300', 'gray.600')}
              type="email"
              size="lg"
              mt={6}
              {...register('email', {
                required: 'This is required field',
              })}
            />
            <FormErrorMessage>{emailMessage}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={usernameMessage !== ''}>
            <Input
              placeholder="username"
              background={useColorModeValue('gray.300', 'gray.600')}
              type="text"
              variant="filled"
              size="lg"
              mt={6}
              {...register('username', {
                required: 'This filed is required',
                minLength: {
                  value: 5,
                  message: 'Username must be at least 5 characters',
                },
                maxLength: {
                  value: 24,
                  message: 'Username must be at most 24 characters',
                },
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
                minLength: {
                  value: 5,
                  message: 'Password must be at least 5 characters long',
                },
                maxLength: {
                  value: 24,
                  message: 'Password must be at most 24 characters',
                },
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            isLoading={isSubmitting}
            loadingText="Creating account..."
            width="100%"
            colorScheme="green"
            variant="outline"
            mt={6}
            mb={6}
            type="submit"
          >
            Register
          </Button>
        </form>
        <ThemeToggler showLabel={true} />
        <Button
          onClick={() => navigate('/login', { replace: true })}
          width="100%"
          colorScheme="gray"
          variant="outline"
          mt={6}
        >
          Login Instead
        </Button>
      </Flex>
    </Flex>
  )
}
