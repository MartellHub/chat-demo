import Header from './appComponents/Header';
import Home from './appComponents/Home';
import About from './appComponents/About';
import Footer from './appComponents/Footer';
import './App.css';

function App() {
  return (
    <div>
      <div className='flex flex-col w-screen h-screen'>
        <Header />
        <main className='flex-1 overflow-y-auto'>
          <div className='min-h-full flex flex-col items-center'>
            <Home />
            <About />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
