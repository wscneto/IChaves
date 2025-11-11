import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // On client-side, ensure we've attempted to load the token from localStorage
  if (process.client) {
    // If the store hasn't initialized yet, or if the token is null and it's not loading,
    // force an initialization. This handles cases where the store might not have run initializeAuth yet.
    if (authStore.isLoading || (!authStore.token && !authStore.isAuthenticated)) {
      await authStore.initializeAuth()
    }
  }

  // If we are on the server, and no token is present (because localStorage isn't available),
  // we should not redirect immediately, as the client will handle it.
  // However, if we are on the client and still no token, then redirect.
  if (!authStore.token && to.path !== '/') {
    // Check for token in URL query parameters
    const tokenFromUrl = to.query.token as string
    if (tokenFromUrl) {
      await authStore.setToken(tokenFromUrl)
      // Remove token from URL after setting it
      return navigateTo(to.path, { replace: true })
    } else {
      // No token in localStorage or URL, redirect to external login
      return navigateTo('https://pisic.vercel.app/', { external: true })
    }
  }
})