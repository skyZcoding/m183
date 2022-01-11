export default function ({ app, route, redirect }) {
  const user = app.$fire.auth.currentUser

  if (route.path === '/blog/createpost') {
    if (!user) {
      return redirect('/auth/register')
    } else {
      app.$fire.firestore.collection('users').where('uid', '==', user.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (!doc.data().smsAuth) {
              return redirect('/auth/register')
            }
          })
        })
    }
  } else if (route.path === '/auth/register' || route.path === '/auth/login') {
    if (user) {
      return redirect('/error')
    }
  }
}
