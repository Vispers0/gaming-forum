import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ReactKeycloakProvider } from '@react-keycloak-fork/web'
import keycloak from '../keycloak.ts'

// import App from './App.tsx'
import Home from './Home.tsx'
import CreatePost from './CreatePost.tsx'
import Layout from './Layout.tsx'
import Profile from "./Profile.tsx";
import UnderDevelopment from "./UnderDevelopment.tsx";
import Games from "./Games.tsx";

const router = createBrowserRouter([{
  path: "/",
  element: <Layout />,
  children: [
    { index: true, element: <Navigate to="/home" replace /> },
    // {path: "/", element: <App />},
    {path: "/home", element: <Home />},
    {path: "/post", element: <CreatePost />},
    {path: "/profile", element: <Profile />},
    {path: "/friends", element: <UnderDevelopment />},
    {path: "/messages", element: <UnderDevelopment />},
    {path: "/groups", element: <UnderDevelopment />},
    {path: "/games", element: <Games />},
    {path: "/guides", element: <UnderDevelopment />},
    {path: "/teammates", element: <UnderDevelopment />},
  ]
}
]);

// const handleKeycloakEvent = (event: string, error?: Error) => {
//   console.log("Keycloak event:", event, error)
// }

const handleKeycloakTokens = (tokens: any) => {
  console.log('Keycloak tokens updated:', tokens);
};



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactKeycloakProvider
      authClient={ keycloak }
      initOptions={{
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256'
      }}
      
      // onEvent={handleKeycloakEvent}
      onTokens={handleKeycloakTokens}
      autoRefreshToken={true}
    >

      <RouterProvider router={router}/>
    </ReactKeycloakProvider>
  </StrictMode>,
)
