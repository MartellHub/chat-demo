import './App.css'

import Home from './appComponents/Home'
import Header from './appComponents/Header'
import Footer from './appComponents/Footer'
import Chat from './chatComponents/Chat'


function App() {
  return (
    <div className='flex flex-col w-screen h-screen'>
      <Header />
      <div className='flex flex-1'>
        <Home />
      </div>
      <Footer />
    </div>
  )
}

export default App