'use strict'

const firebase = require('../db')
const Post = require('../models/post')
const firestore = firebase.firestore()

const getPublishedPosts = async (req, res, next) => {
  try {
    const postsArray = []
    const snapshot = await firestore.collection('posts').where('status', '==', 'published').get()
    if (snapshot.empty) {
      res.status(404).send('No posts found')
    } else {
      snapshot.forEach(doc => {
        const post = new Post.Post(
          doc.id,
          new Post.Author(doc.data().author.email, doc.data().author.uid),
          doc.data().content,
          doc.data().status,
          doc.data().title
        )
        postsArray.push(post)
      })
      res.send(postsArray)
    }
    
  } catch (error) {
    res.status(400).send(error.message)
  }
  
}

module.exports = {
  getPublishedPosts
}