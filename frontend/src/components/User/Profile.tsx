import { useState } from 'react'
import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { UserProfileEdit } from './ProfileEdit'
import { useAuth } from '../../hooks/useAuth'

export function UserProfile(): JSX.Element {
  const { reset, user } = useAuth()
  const [loading, setLoading] = useState(false)

  function fetchUser() {
    console.log('Fetch user')
    setLoading(true)
    reset()
    setLoading(false)
  }

  return (
    <Flex
      minH={'10vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        {user === undefined || loading ? (
          <Center mt={6}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="green.200"
              color="green.500"
              size="xl"
            />
          </Center>
        ) : (
          <>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
              User Profile
            </Heading>

            <FormControl id="firstName" isReadOnly>
              <FormLabel>First name</FormLabel>
              <Input type="text" value={user.firstName} />
            </FormControl>
            <FormControl id="lastName" isReadOnly>
              <FormLabel>Last name</FormLabel>
              <Input type="text" value={user.lastName} />
            </FormControl>
            <FormControl id="userName" isReadOnly>
              <FormLabel>User name</FormLabel>
              <Input
                placeholder="UserName"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                value={user.username}
              />
            </FormControl>
            <FormControl id="email" isReadOnly>
              <FormLabel>Email address</FormLabel>
              <Input
                placeholder="your-email@example.com"
                _placeholder={{ color: 'gray.500' }}
                type="email"
                value={user.email}
              />
            </FormControl>
            <Stack spacing={6} direction={['column', 'row']}>
              <UserProfileEdit onSuccess={fetchUser} defaultValues={user} />
            </Stack>
          </>
        )}
      </Stack>
    </Flex>
  )
}
