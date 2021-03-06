<template>
  <v-app>
    <p v-if="$fetchState.pending">
      Loading....
    </p>
    <p v-else-if="$fetchState.error">
      Error while fetching post
    </p>
    <div v-else>
      <v-card v-if="post">
        <v-card-title>
          <h1>{{ post.title }}</h1>
        </v-card-title>
        <v-card-text>
          {{ post.content }}
        </v-card-text>
        <v-divider />
        <v-card-text class="postBottom">
          <div class="postAuthor">
            {{ post.author.email }}
            <v-btn
              v-if="post.author.uid === author.uid && post.status !== 'deleted'"
              @click="deletePost"
            >
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </div>
          <div class="postStatus">
            Status: {{ post.status }}
            <v-combobox
              v-if="isAdmin"
              v-model="selected"
              :items="statusOptions"
            />
            <v-btn
              v-if="isAdmin"
              @click="updateStatus"
            >
              Update Status
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
      <v-card v-else>
        <v-card-text>
          Error while fetching post
        </v-card-text>
      </v-card>
    </div>
    <v-card class="newComment">
      <v-card-title>
        <h3>Add a comment</h3>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-textarea
            v-model="newComment"
            label="Type your comment here..."
            no-resize
            counter="200"
            row-height="24"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="success"
          @click="postComment"
        >
          Post
        </v-btn>
      </v-card-actions>
    </v-card>
    <div class="comments">
      <v-card v-for="(comment, idx) of comments" :key="idx" class="comment">
        <v-card-text class="comment-content">
          {{ comment.content }}
        </v-card-text>
        <v-divider />
        <v-card-text class="author">
          {{ comment.author.email }}
        </v-card-text>
      </v-card>
    </div>
    <v-snackbar
      v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      post: null,
      slug: '',
      comments: [],
      newComment: '',
      author: '',
      isAdmin: false,
      statusOptions: ['hidden', 'deleted', 'published'],
      selected: '',
      snackbarText: 'No error message',
      snackbar: false
    }
  },

  async fetch () {
    this.slug = this.$route.params.slug
    // Check if logged
    if (this.$store.state.user) {
      this.author = this.$store.state.user
      // Check if user is admin
      const userInfo = await this.$fire.firestore.collection('users').doc(this.author.uid).get()
      if (userInfo.data().isAdmin) {
        this.isAdmin = true
      }
    }
    const postInfo = await this.$fire.firestore.collection('posts').doc(this.slug).get()
    console.log(postInfo.data().author)
    // TODO: Get post if user is admin
    if (postInfo.data().status === 'published' || postInfo.data().author.uid === this.author.uid || this.isAdmin) {
      this.post = postInfo.data()
      this.selected = this.post.status

      // Get comments
      const commentsInfo = await this.$fire.firestore.collection('comments').where('postSlug', '==', this.slug).get()
      commentsInfo.forEach((comment) => {
        this.comments.push(comment.data())
      })
    }
  },

  methods: {
    postComment () {
      if (this.validateComment()) {
        try {
          this.$fire.firestore.collection('comments').doc().set({
            content: this.newComment,
            author: this.author,
            postSlug: this.slug
          })
          // Clear new comment input
          this.newComment = ''
          // this.fetch()
        } catch (error) {
          console.log(error)
        }
      }
    },
    validateComment () {
      if (this.newComment.length === 0 || this.newComment.length > 200) {
        this.snackbarText = 'The comment must have between 1 and 200 characters'
        this.snackbar = true
        return false
      }

      if (this.$store.state.user === null) {
        this.snackbarText = 'You must be logged in to write a comment'
        this.snackbar = true
        return false
      }

      return true
    },
    deletePost () {
      const that = this
      this.$fire.firestore.collection('posts').doc(this.slug).update({
        status: 'deleted'
      })
        .catch(function (error) {
          that.snackbar = true
          that.snackbarText = error
        })
        .then(this.$router.push('/'))
    },
    updateStatus () {
      const that = this
      this.$fire.firestore.collection('posts').doc(this.slug).update({
        status: this.selected
      })
        .catch(function (error) {
          that.snackbar = true
          that.snackbarText = error
        })
        .then(function () {
          that.snackbar = true
          that.snackbarText = 'Updated post to status: ' + that.selected
        })
    }
  }
}
</script>

<style>
.post {
    display: block;
    margin: 0 auto;
    padding: 50px 30px;
    min-width: 800px;
    max-width: 800px;
}

.newComment {
  display: block;
  margin: auto;
  margin-top: 5%;
  padding: 30px 15x;
  min-width: 800px;
  max-width: 800px;
}

.comment {
  display: block;
  margin: auto;
  margin-top: 2%;
  padding: 30px 15x;
  min-width: 800px;
  max-width: 800px;
}

.comment-content {
  font-size: 1em ;
}

.postBottom {
  font-size: 0.8em;
  font-style: italic;
}

.postAuthor {
  text-align: right;
}

.postStatus {
  text-align: left;
}

h1 {
    font-size: 28px;
    font-weight: 900;
    margin-bottom: 30px;
}
</style>
