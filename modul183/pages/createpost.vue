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
            label="Title"
          />
          <v-textarea
            label="Content"
            no-resize
            counter="200"
            row-height="24"
          />
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn color="info">
          Create Post
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: 'IndexPage',

  data () {
    return {
      title: '',
      content: '',
      author: '',
      date: ''
    }
  },

  methods: {
    // createPost () {
    //   try {
    //     this.$fire.firestore.collection('posts').doc().set({
    //       name: this.name,
    //       password: this.password
    //     })
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
  }
}
</script>
