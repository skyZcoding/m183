<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="home-page">
        <h2>Latest Posts</h2>
        <div class="articles">
          <div v-for="(post, idx) of posts" :key="idx" class="article">
            <nuxt-link :to="'/blog/' + post.id">
              <div class="article-inner">
                <div class="detail">
                  <h3>{{ post.title }}</h3>
                  <p>{{ post.content }}</p>
                </div>
              </div>
            </nuxt-link>
          </div>
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
    // TODO: Only fetch posts that have status: public or are from current user
    const snapshot = await this.$fire.firestore.collection('posts').get()
    snapshot.forEach((post) => {
      this.tmpPost = post.data()
      this.tmpPost.id = post.id
      this.posts.push(this.tmpPost)
    })
    console.log(this.posts)
  },

  methods: {

  }
}
</script>

<style>
  .home-page {
    padding: 50px 30px;
  }
  h2 {
    margin-bottom: 30px;
    text-align: center;
  }
  .articles {
    margin: 0 auto;
    max-width: 800px;
  }
  .article {
    margin-bottom: 15px;
    min-width: 40%;
  }
  .article-inner {
    padding: 15px;
    background: #FFF;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    display: flex;
  }
  .article-inner .detail {
    padding-left: 15px;
    padding-right: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 100px;
  }
  h3 {
    font-size: 24px;
    text-decoration: none;
  }
  p {
    color: #888;
    font-size: 18px;
    text-decoration: none;
  }
</style>
