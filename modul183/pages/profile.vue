<template>
  <v-card>
    <v-card-title>
      Profile
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            Email:
          </v-col>
          <v-col>
            {{ email }}
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="isPasswordProvider">
            Mobile number:
          </v-col>
          <v-col>
            <v-text-field
              v-if="isPasswordProvider"
              v-model="mobileNumber"
              label="Mobile number"
              hint="example 41791111111"
              type="number"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="isPasswordProvider"
        @click="updateMobileNumber()"
      >
        Update
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      mobileNumber: '',
      isPasswordProvider: false
    }
  },
  created () {
    this.checkUserData()
  },
  methods: {
    checkUserData () {
      const user = this.$fire.auth.currentUser
      this.email = user.email
      this.isPasswordProvider = user.providerData[0].providerId === 'password'
      this.$fire.firestore.collection('users').doc(user.uid)
        .onSnapshot((doc) => {
          this.mobileNumber = doc.data().mobile_number
        })
    },
    async updateMobileNumber () {
      const currentUser = this.$store.state.user
      await this.$fire.firestore.collection('users').doc(currentUser.uid).update({
        mobile_number: this.mobileNumber
      })
    }
  }
}
</script>
