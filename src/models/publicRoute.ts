const publicRoutes = [
   "/",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/signup",
]

export const isPublicRoute = (route : string) => publicRoutes.includes(route);