class Post {
  constructor(postId, author, content, status, title) {
    this.postId = postId
    this.author = author
    this.content = content
    this.status = status
    this.title = title
  }
}

class Author {
  constructor(email, uid) {
    this.email = email
    this.uid = uid
  }
}

module.exports = {
  Post,
  Author
}