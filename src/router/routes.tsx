import { RouteObject, createMemoryRouter } from "react-router-dom"

import Chat from "@/pages/chat"

const routes: RouteObject[] = [
  {
    path: "main_window",
    element: <Chat />,
  },
]

const router = createMemoryRouter(routes, {
  initialEntries: ["/main_window"],
})

export default router
