import Toast from './components/Toast'
import Home from './pages/Home'

import { GlobalStyle } from './styles/GlobalStyles'

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Home />
      <Toast />
    </>
  )
}

export default App
