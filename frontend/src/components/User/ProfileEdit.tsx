import { useState } from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  useToast,
  InputRightElement,
  InputGroup,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import axiosInstance from '../../services/axios'
import { useForm } from 'react-hook-form'
import { RegisterUserProps } from '../Auth/Register'

export type UserProfileEditType = {
  defaultValues?: RegisterUserProps
  onSuccess: () => void
}

export const UserProfileEdit = ({
  onSuccess,
  defaultValues,
}: UserProfileEditType): JSX.Element => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { ...defaultValues },
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (values: LoginUserType) => {
    try {
      await axiosInstance.put(`/users/${defaultValues?.id}`, values)

      toast({
        title: 'User profile updated',
        status: 'success',
        isClosable: true,
        duration: 1500,
      })
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      const msg = err.response.data.detail[0].msg
      console.log(err.response.data.detail)
      toast({
        title: msg,
        status: 'error',
        isClosable: true,
        duration: 1500,
      })
    }
  }
  let passwordMessage = ''
  if (errors.password?.message !== undefined) {
    passwordMessage = errors.password.message.toString()
  }

  return (
    <Box>
      <Button
        bg={'blue.400'}
        color={'white'}
        w="full"
        onClick={onOpen}
        _hover={{
          bg: 'blue.500',
        }}
      >
        Edit
      </Button>
      <Modal
        closeOnOverlayClick={false}
        size="xl"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>{'Update user profile'}</ModalHeader>
            <ModalBody>
              <FormControl id="update-firstName">
                <FormLabel>First name</FormLabel>
                <Input type="text" {...register('firstName')} />
              </FormControl>
              <FormControl id="update-lastName">
                <FormLabel>Last name</FormLabel>
                <Input type="text" {...register('lastName')} />
              </FormControl>
              <FormControl id="username">
                <FormLabel>User name</FormLabel>
                <Input
                  _placeholder={{ color: 'gray.500' }}
                  type="text"
                  {...register('username')}
                />
              </FormControl>
              <FormControl id="update-email">
                <FormLabel>Email address</FormLabel>
                <Input
                  _placeholder={{ color: 'gray.500' }}
                  type="email"
                  {...register('email')}
                />
              </FormControl>
              <FormControl
                id="update-password"
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
                        message: 'Password must be at least 5 characters long',
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
            </ModalBody>
            <ModalFooter>
              <ModalFooter>
                <Stack direction="row" spacing={4}>
                  <Button onClick={onClose} disabled={isSubmitting}>
                    Close
                  </Button>
                  <Button
                    colorScheme="orange"
                    type="submit"
                    loadingText="Updating"
                  >
                    Update
                  </Button>
                </Stack>
              </ModalFooter>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Box>
  )
}
