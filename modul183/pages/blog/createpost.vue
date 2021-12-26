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
        <v-btn
          color="info"
          @click="createPost()"
        >
          Create Post
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: 'CreatePost',

  data () {
    return {
      title: '',
      content: '',
      author: '',
      status: 'hidden'
    }
  },

  methods: {
    createPost () {
      if (this.validatePost() === '') {
        this.author = this.$store.state.user

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
      } else {
        console.log('error: ' + this.validatePost())
        // TODO: Show error message for validation
      }
    },
    validatePost () {
      let errorMsg = ''
      if (this.title.length === 0 || this.title.length > 50) {
        errorMsg = 'The title must have between 1 and 50 characters'
      }
      if (this.content.length === 0 || this.content.length > 2500) {
        errorMsg = 'The content must have between 1 and 2500 characters'
      }

      return errorMsg
    }
  }
}
</script>
