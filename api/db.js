const firebase = require('firebase-admin')
const serviceAccount = require("./m183-327010-firebase-adminsdk-i2gzs-6b10b641c3.json")

const db = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
})

module.exports = db