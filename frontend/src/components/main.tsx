import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import AuthPage from './AuthPage.tsx'
import RegisterPage from './RegisterPage.tsx'

const router = createBrowserRouter([
  {path: "/", element: <App />},
  {path: "/auth", element: <AuthPage />},
  {path: "/register", element: <RegisterPage />}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
