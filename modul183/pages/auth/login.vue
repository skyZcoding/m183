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
        <v-container>
          <v-row class="mb-2">
            <v-btn
              color="success"
              to="/auth/register"
            >
              Register
            </v-btn>
            <v-spacer />
            <v-btn
              color="info"
              class="mr-2"
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
          </v-row>
          <v-row>
            <v-btn
              @click="googleSignIn"
            >
              Sign In with Google
            </v-btn>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
    <SmsAuth ref="dialog" />
  </v-app>
</template>

<script>
import SmsAuth from '../../components/SmsAuth.vue'

export default {
  name: 'LoginPage',
  components: { SmsAuth },

  data () {
    return {
      showPassword: false,
      snackbarText: 'No error message',
      snackbar: false,
      loginSuccess: false,
      auth: {
        email: '',
        password: '',
        verificationCode: ''
      }
    }
  },
  methods: {
    googleSignIn () {
      const provider = new this.$fireModule.auth.GoogleAuthProvider()
      this.$fireModule.auth().signInWithPopup(provider)
        .then((data) => {
          this.loginSuccess = true
          this.$router.push('/')
        })
        .catch(function (error) {
          this.snackbarText = error.message
          this.snackbar = true
        })
    },
    login () {
      if (this.validate()) {
        const that = this
        this.$fire.auth.signInWithEmailAndPassword(this.auth.email, this.auth.password)
          .catch(function (error) {
            that.snackbarText = error.message
            that.snackbar = true
          }).then((data) => {
            that.loginSuccess = true
            that.$refs.dialog.showDialog()
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
    }
  }
}
</script>
