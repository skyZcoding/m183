<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in getFilteredItems()"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn
        v-if="loggedIn()"
        icon
        @click="logout"
      >
        Log out
      </v-btn>
      <v-btn
        v-else
        to="/auth/login"
        icon
      >
        Log in
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  asyncData (app) {
    // app.$fire.auth.signOut()
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
          show: 'always'
        },
        {
          icon: 'mdi-typewriter',
          title: 'Create Post',
          to: '/createpost',
          show: 'loggedIn'
        },
        {
          icon: 'mdi-login',
          title: 'Login',
          to: '/auth/login',
          show: 'loggedOut'
        },
        {
          icon: 'mdi-account-plus',
          title: 'Register',
          to: '/auth/register',
          show: 'loggedOut'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  methods: {
    loggedIn () {
      if (this.$store.state.user === null) {
        return false
      } else {
        return true
      }
    },

    getFilteredItems () {
      const filteredArray = []
      this.items.forEach((item) => {
        if ((this.loggedIn() && item.show !== 'loggedOut') || (!this.loggedIn() && item.show !== 'loggedIn')) {
          filteredArray.push(item)
        }
      })

      return filteredArray
    },

    logout () {
      this.$fire.auth.signOut()
    }
  }
}
</script>
