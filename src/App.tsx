import React from "react"
import { RouterProvider, Link } from "react-router-dom"

import router from "@/router/routes"

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}
