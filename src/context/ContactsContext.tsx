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
}
const API_URL = 'http://localhost:3001/contacts'

const ContactsContext = createContext<ContactsContextType>(
  {} as ContactsContextType
)

export const ContactsProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const stored = localStorage.getItem('contacts')
    return stored ? JSON.parse(stored) : []
  })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts))
  }, [contacts])

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setContacts(data))
  })

  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      setMessage('')

      return () => clearTimeout(timer)
    }, 3000)
  })

  const addContact = async () => {
    if (!name || !email) return
    const newContact = {
      name,
      email,
      isFavorite: false
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newContact)
    })

    const savedContact = await response.json()

    setContacts((prev) => [...prev, savedContact])
    setName('')
    setEmail('')
    setMessage('Um contato foi adicionado')
  }

  const removeContact = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    setContacts((prev) => prev.filter((contact) => contact.id !== id))
    setMessage('O contato foi removido')
  }

  const startEdit = (contact: Contact) => {
    setEditingContact(contact)
    setName(contact.name)
    setEmail(contact.email)
  }

  const updateContact = () => {
    if (!editingContact) return
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === editingContact.id ? { ...contact, name, email } : contact
      )
    )
    setEditingContact(null)
    setName('')
    setEmail('')
    setMessage('O contato foi editado')
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
        message
      }}
    >
      {children}
    </ContactsContext.Provider>
  )
}

export const useContacts = () => useContext(ContactsContext)
