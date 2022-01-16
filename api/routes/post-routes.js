const express =  require('express')
const {getPublishedPosts} = require('../controllers/postController')

const router = express.Router()

router.get('/posts', getPublishedPosts)

module.exports = {
  routes: router
}