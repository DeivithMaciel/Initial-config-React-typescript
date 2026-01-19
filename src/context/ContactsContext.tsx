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
}

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

  const addContact = () => {
    if (!name || !email) return
    const newContact: Contact = {
      id: Date.now(),
      name,
      email,
      isFavorite: false
    }

    setContacts((prev) => [...prev, newContact])
    setName('')
    setEmail('')
  }

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts))
  }, [contacts])

  const removeContact = (id: number) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id))
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
  }

  const toggleFavorite = (id: number) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id
          ? { ...contact, isFavorite: !contact.isFavorite }
          : contact
      )
    )
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
        toggleFavorite
      }}
    >
      {children}
    </ContactsContext.Provider>
  )
}

export const useContacts = () => useContext(ContactsContext)
