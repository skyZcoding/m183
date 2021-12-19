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
      :timeout="4000"
      absolute
      bottom
      right
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
        password: ''
      }
    }
  },
  methods: {
    login () {
      const that = this
      this.$fire.auth.signInWithEmailAndPassword(this.auth.email, this.auth.password)
        .catch(function (error) {
          that.snackbarText = error.message
          that.snackbar = true
        }).then((user) => {
          this.$router.push('/')
        }
        )
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
    }
  }
}
</script>
