const express = require('express')

const app = express()
app.use(express.json())

app.get('/posts', async (req, res) => {
  const posts = []
  const snapshot = await app.$fire.firestore.collection('posts').get()
  snapshot.forEach((post) => {
    const tmpPost = post.data()
    if (tmpPost.status === 'published') {
      tmpPost.id = post.id
      posts.push(tmpPost)
    }
  })

  res.json(posts)
})

module.exports = app
