export default function ({ app, route, redirect }) {
  const user = app.$fire.auth.currentUser

  if (route.path !== '/auth/register' && route.path !== '/auth/login') {
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
  } else if (route.path === '/admindashboard') {
    if (user) {
      app.$fire.firestore.collection('users').doc(user.uid)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.data().isAdmin) {
            return redirect('/error')
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      return redirect('/error')
    }
  } else if (route.path === '/userdashboard') {
    if (user) {
      app.$fire.firestore.collection('users').doc(user.uid)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.data().isAdmin) {
            return redirect('/error')
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      return redirect('/error')
    }
  } else if (route.path === '/api/posts') {
    return redirect('http://localhost:8080/api/posts')
  }
}
