import {
  Button,
  Center,
  Container,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../services/axios'
import { AddUpdateTodoModal } from './AddUpdateTodoModal'
import { TodoType } from './types'

export const TodoDetail = () => {
  const [todo, setTodo] = useState<TodoType | null>(null)
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const background = useColorModeValue('gray.300', 'gray.600')

  useEffect(() => {
    if (isMounted.current) return
    fetchTodo()
    isMounted.current = true
  }, [id])

  const fetchTodo = () => {
    setLoading(true)
    axiosInstance
      .get(`/todo/${id}`)
      .then((res) => {
        setTodo(res.data)
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false)
      })
  }

  const delateTodo = () => {
    setLoading(true)
    axiosInstance
      .delete(`/todo/${id}`)
      .then(() => {
        toast({
          title: 'Todo deleted successfully',
          status: 'success',
          isClosable: true,
          duration: 1500,
        })
        navigate('/')
      })
      .catch((err) => {
        console.error(err)
        toast({
          title: "Could'nt delete todo",
          status: 'error',
          isClosable: true,
          duration: 2000,
        })
      })
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <Container mt={6}>
        <Center mt={6}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="green.200"
            color="green.500"
            size="xl"
          />
        </Center>
      </Container>
    )
  }

  return (
    <>
      <Container mt={6}>
        <Button
          colorScheme="gray"
          onClick={() => navigate('/', { replace: true })}
        >
          Back
        </Button>
      </Container>
      <Container
        bg={background}
        minHeight="7rem"
        my={3}
        p={3}
        rounded="lg"
        alignItems="center"
        justifyContent="space-between"
      >
        {todo === null ? (
          <Text>There is nothing to do</Text>
        ) : (
          <>
            <Text fontSize={22}>{todo.title}</Text>
            <Text bg="gray.500" mt={2} p={2} rounded="lg">
              {todo.description}
            </Text>
            <AddUpdateTodoModal
              my={3}
              editable={true}
              defaultValues={{
                id: todo.id,
                title: todo.title,
                description: todo.description,
                status: todo.status,
              }}
              onSuccess={fetchTodo}
            />
            <Button colorScheme="red" width="100%" onClick={delateTodo}>
              Delete
            </Button>
          </>
        )}
      </Container>
    </>
  )
}
