<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="home-page">
        <h2>Admin Dashboard</h2>
        <div class="qrcode">
          <v-card>
            <v-card-title>
              Your TOTP QR code
            </v-card-title>
            <v-card-text>
              <img :src="qrCodeImg">
            </v-card-text>
          </v-card>
        </div>
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
const QRCode = require('qrcode')
const speakeasy = require('speakeasy')
export default {
  data () {
    return {
      posts: [],
      qrCodeImg: '',
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
    // Check if logged
    if (this.$store.state.user) {
      this.author = this.$store.state.user
      // Check if user is admin
      const userInfo = await this.$fire.firestore.collection('users').doc(this.author.uid).get()
      if (userInfo.data().isAdmin) {
        this.qrCodeImg = await this.createQrCode(userInfo.data().secret)
      }
    }

    const snapshot = await this.$fire.firestore.collection('posts').get()
    snapshot.forEach((post) => {
      this.tmpPost = post.data()
      this.tmpPost.id = post.id
      this.posts.push(this.tmpPost)
    })
    console.log(this.posts)
  },
  methods: {
    async createQrCode (secretPar) {
      const url = speakeasy.otpauthURL({ secret: secretPar.ascii, label: 'M183 (' + this.author.email + ')', algorithm: 'sha1' })
      const qrCode = await QRCode.toDataURL(url)
      return qrCode
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
