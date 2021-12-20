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
            v-model="auth.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
          <v-text-field
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
  </v-app>
</template>

<script>
export default {
  name: 'RegisterPage',

  data () {
    return {
      showPassword: false,
      auth: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    register () {
      const that = this
      this.$fire.auth.createUserWithEmailAndPassword(this.auth.email, this.auth.password)
        .then(function () {
          that.$router.push('/')
        })
    }
  }
}
</script>
