import { useContacts } from '../../context/ContactsContext'

import Header from '../../components/Header'
import ContactCard from '../../components/ContactCard'
import ContactForm from '../../components/ContactForm'

import * as S from './styles'

const Home = () => {
  const { contacts } = useContacts()

  const orderedContacts = [...contacts].sort(
    (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
  )

  return (
    <>
      <Header />
      <S.ContainerHome>
        <ContactForm />
        {orderedContacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
        {orderedContacts.length === 0 && (
          <S.EmptyMessage>
            Sua lista de contato está vazia, adicione algum contato acima no
            formulário.
          </S.EmptyMessage>
        )}
      </S.ContainerHome>
    </>
  )
}

export default Home
