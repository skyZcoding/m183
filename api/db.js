const firebase = require('firebase-admin')
const serviceAccount = require("./m183-327010-firebase-adminsdk-c3lef-0b324638a8.json")

const db = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
})

module.exports = db