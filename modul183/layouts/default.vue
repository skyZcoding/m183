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
          v-for="(item, i) in filteredArray"
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
      :absolute="fixed"
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
          to: '/blog/createpost',
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
      filteredArray: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  mounted () {
    console.log('mount')
    this.getFilteredItems()
  },
  activated () {
    console.log('active')
  },
  update () {
    console.log('update')
  },
  create () {
    console.log('create')
    this.getFilteredItems()
  },
  methods: {
    loggedIn () {
      return !(this.$store.state.user === null)
    },

    async isSmsAuth () {
      console.log('isSmsAuth')
      if (this.loggedIn()) {
        const userId = this.$store.state.user.uid
        const snapshot = await this.$fire.firestore.collection('users').where('uid', '==', userId).get()
        let smsAuth = true
        snapshot.forEach((temp) => {
          const user = temp.data()
          smsAuth = user.smsAuth
        })
        return smsAuth
      }
    },

    async getFilteredItems () {
      this.filteredArray = []
      const smsAuth = await this.isSmsAuth()
      this.items.forEach((item) => {
        if ((this.loggedIn() && smsAuth && item.show !== 'loggedOut') || ((!this.loggedIn() || (this.loggedIn() && !smsAuth)) && item.show !== 'loggedIn')) {
          this.filteredArray.push(item)
        }
      })
    },

    async logout () {
      const currentUser = this.$fire.auth.currentUser
      await this.$fire.firestore.collection('users').doc(currentUser.uid).update({
        smsAuth: true
      })
      this.$fire.auth.signOut()
    }
  }
}
</script>
