import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter, createRootRoute, createRoute, RouterProvider } from "@tanstack/react-router"

// Route components
import { HomePage } from "./routes/home"
import { SettingsPage } from "./routes/settings"

// Create the root route
const rootRoute = createRootRoute()

// Create index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
})

// Create settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
})

// Add children to root route
const routeTree = rootRoute.addChildren([indexRoute, settingsRoute])

// Create the router
function App() {
  const [queryClient] = useState(() => new QueryClient())
  const [router] = useState(() =>
    createRouter({
      routeTree,
      context: {
        queryClient,
      },
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
