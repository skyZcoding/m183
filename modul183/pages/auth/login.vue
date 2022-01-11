<template>
  <v-app>
    <v-card width="400" class="mx-auto">
      <v-card-title>
        <h1 class="display-1">
          Login
        </h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="auth.email"
            label="E-Mail"
            name="email"
            type="text"
            prepend-icon="mdi-email"
          />
          <v-text-field
            v-model="auth.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          color="success"
          to="/auth/register"
        >
          Register
        </v-btn>
        <v-spacer />
        <v-btn
          color="info"
          @click="login"
        >
          Login
        </v-btn>
        <v-btn
          depressed
          @click="forgotPassword"
        >
          Forgot Password
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
  name: 'LoginPage',

  data () {
    return {
      showPassword: false,
      snackbarText: 'No error message',
      snackbar: false,
      auth: {
        email: '',
        password: '',
        verificationCode: ''
      }
    }
  },
  methods: {
    login () {
      if (this.validate()) {
        const that = this
        this.$fire.auth.signInWithEmailAndPassword(this.auth.email, this.auth.password)
          .catch(function (error) {
            that.snackbarText = error.message
            that.snackbar = true
          }).then((data) => {
            this.sendSmsCode()
            this.$router.push('/')
          })
      }
    },
    forgotPassword () {
      this.$fire.auth.sendPasswordResetEmail(this.auth.email)
        .then(function () {
          this.snackbarText = 'reset link sent to ' + this.auth.email
          this.snackbar = true
        })
        .catch(function (error) {
          this.snackbarText = error.message
          this.snackbar = true
        })
    },
    validate () {
      if (this.auth.email.length === 0 || this.auth.password.length === 0) {
        this.snackbarText = 'The input fields can not be empty'
        this.snackbar = true
        return false
      }

      return true
    },
    async sendSmsCode () {
      this.generateVerificationCode()

      const payload = {
        mobileNumber: await this.getUserMobileNumber(),
        message: 'Your verification code is #' + this.auth.verificationCode + '.'
      }
      console.log('test')
      console.log(payload)

      fetch('https://m183.gibz-informatik.ch/api/sms/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'test'
        },
        body: JSON.stringify(payload)
      })
    },
    async getUserMobileNumber () {
      const currentUser = this.$fire.auth.currentUser
      const snapshot = await this.$fire.firestore.collection('users').where('uid', '==', currentUser.uid).get()
      let mobileNumber = ''
      snapshot.forEach((temp) => {
        const user = temp.data()
        mobileNumber = user.mobile_number
      })

      return mobileNumber
    },
    generateVerificationCode () {
      this.auth.verificationCode = Math.floor(Math.random() * 999999)
    }
  }
}
</script>
