import { createContext, useContext, useEffect, useState } from 'react'

import { Contact } from '../types/Contact'

type ContactsContextType = {
  contacts: Contact[]
  name: string
  email: string
  setName: (value: string) => void
  setEmail: (value: string) => void
  addContact: () => void
  removeContact: (id: number) => void
  toggleFavorite: (id: number) => void
  editingContact: Contact | null
  startEdit: (contact: Contact) => void
  updateContact: () => void
  message: string
  loading: boolean
}
const API_URL = 'https://json-server-listadecontatoscrud.onrender.com/contacts'

const ContactsContext = createContext<ContactsContextType>(
  {} as ContactsContextType
)

export const ContactsProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch(() => setMessage('Erro ao carregar contatos'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      setMessage('')
    }, 3000)

    return () => clearTimeout(timer)
  }, [message])

  const addContact = async () => {
    if (!name || !email) return

    try {
      setLoading(true)

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          isFavorite: false
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao adicionar contato')
      }

      const savedContact = await response.json()

      setContacts((prev) => [...prev, savedContact])
      setName('')
      setEmail('')
      setMessage('Um contato foi adicionado')
    } catch (error) {
      setMessage('Erro ao adicionar contato')
    } finally {
      setLoading(false)
    }
  }

  const removeContact = async (id: number) => {
    try {
      setLoading(true)

      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      setContacts((prev) => prev.filter((contact) => contact.id !== id))

      setMessage('O contato foi removido')
    } catch {
      setMessage('Erro ao remover contato')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (contact: Contact) => {
    setEditingContact(contact)
    setName(contact.name)
    setEmail(contact.email)
  }

  const updateContact = async () => {
    if (!editingContact) return

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/${editingContact.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editingContact,
          name,
          email
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar o contato')
      }

      const updateContact = await response.json()

      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === updateContact.id ? updateContact : contact
        )
      )

      setEditingContact(null)
      setName('')
      setEmail('')
      setMessage('Contato atualizado')
    } catch {
      setMessage('Erro ao editar o contato')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (id: number) => {
    const contact = contacts.find((c) => c.id === id)
    if (!contact) return

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isFavorite: !contact.isFavorite
      })
    })
    const updateContact = await response.json()

    setContacts((prev) => prev.map((c) => (c.id === id ? updateContact : c)))
  }

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        name,
        email,
        setName,
        setEmail,
        editingContact,
        addContact,
        startEdit,
        updateContact,
        removeContact,
        toggleFavorite,
        message,
        loading
      }}
    >
      {children}
    </ContactsContext.Provider>
  )
}

export const useContacts = () => useContext(ContactsContext)
