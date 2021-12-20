export default function ({ app, route, redirect }) {
  /* if (route.path !== '/auth/login' || route.path !== '/auth/register') {
    if (!app.$fire.auth.currentUser) {
      return redirect('/auth/register')
    }
  } else if (route.path === '/auth/login') {
    if (!app.$fire.auth.currentUser) {
      // leave them on the login page
    } else {
      return redirect('/')
    }
  } */
  if (route.path === '/createpost') {
    if (!app.$fire.auth.currentUser) {
      return redirect('/auth/register')
    }
  }
}
