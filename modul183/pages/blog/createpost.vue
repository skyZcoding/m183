<template>
  <v-app>
    <v-card width="1000" class="mx-auto">
      <v-card-title>
        <h1 class="display-1">
          Create a Post
        </h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="title"
            label="Title"
            counter="50"
          />
          <v-textarea
            v-model="content"
            label="Content"
            no-resize
            counter="2500"
            row-height="24"
            rows="15"
          />
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <div class="postStatus">
          <v-combobox
            v-if="isAdmin"
            v-model="status"
            :items="statusOptions"
          />
        </div>
        <v-text-field
          v-if="status === 'hidden' && isAdmin"
          v-model="code"
          label="TOTP code"
          hint="6-digit code"
          type="number"
        />
        <v-btn
          color="info"
          @click="createPost()"
        >
          Create Post
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script>
const speakeasy = require('speakeasy')

export default {
  name: 'LoginPage',

  data () {
    return {
      title: '',
      content: '',
      author: '',
      status: 'hidden',
      code: '',
      secret: '',
      isAdmin: false,
      statusOptions: ['hidden', 'published'],
      snackbar: false,
      snackbarText: ''
    }
  },

  async fetch () {
    // Check if user is admin
    if (this.$store.state.user) {
      this.author = this.$store.state.user

      const userInfo = await this.$fire.firestore.collection('users').doc(this.author.uid).get()
      if (userInfo.data().isAdmin) {
        this.isAdmin = true
        this.secret = userInfo.data().secret.base32
      }
    }
  },

  methods: {
    createPost () {
      if (this.validatePost()) {
        if (this.status === 'hidden') {
          if (this.validateTOTP()) {
            console.log('before publish')
            this.publishPost()
          } else {
            this.snackbarText = 'TOTP Code is wrong'
            this.snackbar = true
          }
        } else {
          this.publishPost()
        }
      }
    },
    publishPost () {
      try {
        this.$fire.firestore.collection('posts').doc().set({
          title: this.title,
          content: this.content,
          status: this.status,
          author: this.author
        })
        // Clear new post inputs
        this.title = ''
        this.content = ''
      } catch (error) {
        console.log(error)
      }
    },
    validatePost () {
      if (this.title.length === 0 || this.title.length > 50) {
        this.snackbarText = 'The title must have between 1 and 50 characters'
        this.snackbar = true
        return false
      }
      if (this.content.length === 0 || this.content.length > 2500) {
        this.snackbarText = 'The content must have between 1 and 2500 characters'
        this.snackbar = true
        return false
      }

      return true
    },
    validateTOTP () {
      console.log('inside validateTOTP secret: ' + this.secret)
      console.log('OTP: ' + this.code)
      return speakeasy.totp.verify({
        secret: this.secret,
        encoding: 'base32',
        token: this.code
      })
    }
  }
}
</script>
