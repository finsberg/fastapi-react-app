import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Stack,
  Text,
  Link,
  Box,
  FormLabel,
  Checkbox,
  Input,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ThemeToggler } from '../Theme/ThemeToggler'
// import { LoginUserType } from './UserType.types'

export type LoginUserProps = {
  username: string
  password: string
}

export const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserProps>()

  const navigate = useNavigate()
  const { login } = useAuth()
  const toast = useToast()

  const onSubmit = async (values: LoginUserProps) => {
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
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool <Link color={'blue.400'}>features</Link>{' '}
              ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={4}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl id="username" isInvalid={usernameMessage !== ''}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    {...register('username', {
                      required: 'This is required field',
                    })}
                  />
                  <FormErrorMessage>{usernameMessage}</FormErrorMessage>
                </FormControl>
                <FormControl id="password" isInvalid={passwordMessage !== ''}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    {...register('password', {
                      required: 'This is required field',
                    })}
                  />
                  <FormErrorMessage>{passwordMessage}</FormErrorMessage>
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}
                  >
                    <Checkbox>Remember me</Checkbox>
                    <Link color={'blue.400'}>Forgot password?</Link>
                  </Stack>
                  <Button
                    isLoading={isSubmitting}
                    loadingText="Logging in..."
                    bg={'blue.400'}
                    color={'white'}
                    type="submit"
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    Sign in
                  </Button>
                </Stack>
              </form>
              <Stack align={'center'}>
                <ThemeToggler showLabel={true} />
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Don&apos;t have an account yet?{' '}
                  <Link
                    color={'blue.400'}
                    onClick={() => navigate('/register', { replace: true })}
                  >
                    Register
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Flex>
  )
}
