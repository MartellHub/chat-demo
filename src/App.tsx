import './App.css'

import Home from './appComponents/Home'
import Header from './appComponents/Header'
import Footer from './appComponents/Footer'
import Chat from './chatComponents/Chat'


function App() {
  return (
    <div>
      <Header />
      <div >
        <Home />
      </div>
      <Footer />
    </div>
  )
}

export default App