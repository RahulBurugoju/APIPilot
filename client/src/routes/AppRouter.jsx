import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'

 function AppRouter() {
    const router = createBrowserRouter([
        {
            path:"/",
            element:<div>APIpilot</div>
        }
    ])
  return (
    <RouterProvider router={router}/>
  )
}

export default AppRouter
