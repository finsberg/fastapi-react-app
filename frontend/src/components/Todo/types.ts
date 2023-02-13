export type TodoType = {
  id: string
  title?: string
  status?: boolean
  description?: string
}

export type AddUpdateTodoModalType = {
  my?: number
  editable?: boolean
  defaultValues?: TodoType
  onSuccess: () => void
}
