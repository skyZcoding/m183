export default function ({ app, route, redirect }) {
  if (route.path === '/createpost') {
    if (!app.$fire.auth.currentUser) {
      return redirect('/auth/register')
    }
  } else if (route.path === '/auth/register' || route.path === '/auth/login') {
    if (app.$fire.auth.currentUser) {
      return redirect('/error')
    }
  }
}
