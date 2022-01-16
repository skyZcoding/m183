<template>
  <v-app>
    <v-card width="400" class="mx-auto">
      <v-card-title>
        <h1 class="display-1">
          Register
        </h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="auth.email"
            label="E-Mail"
            prepend-icon="mdi-email"
          />
          <v-text-field
            v-model="auth.mobile_number"
            label="Mobile number"
            prepend-icon="mdi-phone"
          />
          <v-text-field
            v-model="auth.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
          <v-text-field
            v-model="auth.cpassword"
            :type="showPassword ? 'text' : 'password'"
            label="Confirm Password"
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
          @click="register"
        >
          Register
        </v-btn>
        <v-spacer />
        <v-btn color="info" to="/auth/login">
          Login
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
  name: 'RegisterPage',

  data () {
    return {
      showPassword: false,
      snackbarText: 'No error message',
      snackbar: true,
      auth: {
        email: '',
        mobile_number: '',
        password: '',
        cpassword: ''
      }
    }
  },
  methods: {
    register () {
      if (this.validate()) {
        const that = this
        this.$fire.auth.createUserWithEmailAndPassword(this.auth.email, this.auth.password)
          .then(function (data) {
            that.$fire.firestore.collection('users').doc(data.user.uid).set({
              isAdmin: false,
              smsAuth: true,
              mobile_number: that.auth.mobile_number,
              uid: data.user.uid,
              secret: that.createSecret()
            })
            that.$router.push('/userdashboard')
          })
      }
    },
    createSecret () {
      const secretPar = speakeasy.generateSecret()
      const secret = {
        base32: secretPar.base32,
        ascii: secretPar.ascii
      }
      console.log('created secret: ' + secret)
      return secret
    },
    hasLowerCase (str) {
      return (/[a-z]/.test(str))
    },
    hasUpperCase (str) {
      return (/[A-Z]/.test(str))
    },
    validate () {
      const format = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/

      if (this.auth.password !== this.auth.cpassword) {
        this.snackbarText = 'The "Password" and the "Confirm Password" has to be equal'
        this.snackbar = true
        return false
      }

      if (!this.hasLowerCase(this.auth.password)) {
        this.snackbarText = 'The "Password" has to contain lowercase characters'
        this.snackbar = true
        return false
      }

      if (!this.hasUpperCase(this.auth.password)) {
        this.snackbarText = 'The "Password" has to contain uppercase characters'
        this.snackbar = true
        return false
      }

      if (!format.test(this.auth.password)) {
        this.snackbarText = 'The "Password" has to contain special characters'
        this.snackbar = true
        return false
      }

      if (this.auth.password.length < 7) {
        this.snackbarText = 'The "Password" has to be at least 8 characters'
        this.snackbar = true
        return false
      }

      return true
    }
  }
}
</script>
