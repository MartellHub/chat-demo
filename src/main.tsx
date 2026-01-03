import { createRoot } from 'react-dom/client'
import { RouterProvider  , createBrowserRouter} from 'react-router-dom'
import { AuthProvider } from '../firebase/AuthContext';

import App from './App';
import Chat from './chatComponents/Chat';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/Chat',
    element: <Chat />
  },
]);

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router = {router}/> 
  </AuthProvider>,
)
    {/* <RouterProvider router = {router}/> */}
