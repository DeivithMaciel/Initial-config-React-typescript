import { useContacts } from '../../context/ContactsContext'

import { Form } from './styles'

const ContactForm = () => {
  const {
    name,
    email,
    setName,
    setEmail,
    addContact,
    updateContact,
    editingContact
  } = useContacts()

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          editingContact ? updateContact() : addContact()
        }}
      >
        <input
          type="text"
          placeholder="nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">{editingContact ? 'Editar' : 'Adicionar'}</button>
      </Form>
    </>
  )
}

export default ContactForm
