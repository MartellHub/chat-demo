import './App.css'

import Home from './appComponents/Home'
import Header from './appComponents/Header'
import Footer from './appComponents/Footer'
import Chat from './chatComponents/Chat'
import About from './appComponents/About'


function App() {
  return (
    <div className='flex flex-col w-screen h-screen'>
      <Header />
      <main className="flex-1 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center">
        <Home />
        <About />
      </div>
    </main>
      <Footer />
    </div>
  )
}

export default App