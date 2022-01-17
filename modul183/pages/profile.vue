<template>
  <v-app>
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
      email: '',
      mobileNumber: '',
      isPasswordProvider: false,
      snackbar: false,
      snackbarText: 'No error message'
    }
  },
  created () {
    this.checkUserData()
  },
  methods: {
    validate () {
      if (this.mobileNumber < 41700000000 || this.mobileNumber > 41799999999) {
        this.snackbarText = 'The "Mobile number" has two be between 41700000000 and 41799999999'
        this.snackbar = true
        return false
      }

      return true
    },
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
      if (this.validate()) {
        const currentUser = this.$store.state.user
        await this.$fire.firestore.collection('users').doc(currentUser.uid).update({
          mobile_number: this.mobileNumber
        })
      }
    }
  }
}
</script>
