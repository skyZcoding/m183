<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="home-page">
        <h2>Your Posts</h2>
        <div class="posts">
          <v-card v-for="(post, idx) of posts" :key="idx" class="post">
            <v-card-title>
              <nuxt-link :to="'/blog/' + post.id">
                {{ post.title }}
              </nuxt-link>
            </v-card-title>
            <v-card-text class="post-content">
              {{ post.content }}
            </v-card-text>
            <v-divider />
            <v-card-text class="author">
              {{ post.author.email }}
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      posts: [],
      tmpPost: {
        id: '',
        author: {
          email: '',
          uid: ''
        },
        content: '',
        status: '',
        title: ''
      }
    }
  },

  async fetch () {
    const snapshot = await this.$fire.firestore.collection('posts').where('author', '==', this.returnUser()).get()
    snapshot.forEach((post) => {
      this.tmpPost = post.data()
      this.tmpPost.id = post.id
      this.posts.push(this.tmpPost)
    })
    console.log(this.posts)
  },

  methods: {
    returnUser () {
      if (this.$store.state.user !== null) {
        return this.$store.state.user
      } else {
        return 'empty'
      }
    }
  }
}
</script>

<style>
.post {
  margin-top: 4% !important;
}

.post-content {
  font-size: 1em;
  max-height: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.author {
  font-size: 0.8em;
  font-style: italic;
  text-align: right;
}
</style>
