import { useState } from 'react'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Stack,
  FormLabel,
  Text,
  Box,
  HStack,
  InputGroup,
  InputRightElement,
  Heading,
  Input,
  Link,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
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
  const [showPassword, setShowPassword] = useState(false)

  const toast = useToast()

  const onSubmit = async (values: LoginUserType) => {
    try {
      await axiosInstance.post('/users', values)
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
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Flex
        direction="column"
        alignItems="center"
        background={useColorModeValue('gray.50', 'gray.800')}
        p={12}
        rounded={6}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}
            >
              <Stack spacing={4}>
                <HStack>
                  <Box>
                    <FormControl id="firstName" isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        type="text"
                        {...register('firstName', {
                          required: 'This filed is required',
                        })}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName">
                      <FormLabel>Last Name</FormLabel>
                      <Input type="text" {...register('lastName')} />
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl
                  id="email"
                  isRequired
                  isInvalid={emailMessage !== ''}
                >
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    {...register('email', {
                      required: 'This filed is required',
                    })}
                  />
                  <FormErrorMessage>{emailMessage}</FormErrorMessage>
                </FormControl>
                <FormControl
                  id="username"
                  isRequired
                  isInvalid={usernameMessage !== ''}
                >
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="username"
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
                <FormControl
                  id="password"
                  isRequired
                  isInvalid={passwordMessage !== ''}
                >
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'This is required field',
                        minLength: {
                          value: 5,
                          message:
                            'Password must be at least 5 characters long',
                        },
                        maxLength: {
                          value: 24,
                          message: 'Password must be at most 24 characters',
                        },
                      })}
                    />
                    <InputRightElement h={'full'}>
                      <Button
                        variant={'ghost'}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    isLoading={isSubmitting}
                    loadingText="Creating account..."
                    size="lg"
                    bg={'blue.400'}
                    type="submit"
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    Sign up
                  </Button>
                </Stack>
                <Stack align={'center'} pt={6}>
                  <ThemeToggler showLabel={true} />
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'}>
                    Already a user?{' '}
                    <Link
                      color={'blue.400'}
                      onClick={() => navigate('/login', { replace: true })}
                    >
                      Login
                    </Link>
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </form>
        </Stack>
      </Flex>
    </Flex>
  )
}
