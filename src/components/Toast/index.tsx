import { useContacts } from '../../context/ContactsContext'

import { ToastBox } from './styles'

const Toast = () => {
  const { message } = useContacts()

  if (!message) return null

  return <ToastBox>{message}</ToastBox>
}

export default Toast
