export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    users: '/dashboard/users',
    residents: '/dashboard/residents',
    apartments: '/dashboard/apartments',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
