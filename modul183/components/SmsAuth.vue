<template>
  <v-dialog
    v-model="dialog"
    max-width="290"
  >
    <v-card>
      <v-card-title class="text-h5">
        Verification code
      </v-card-title>

      <v-card-text>
        The verification code was sent to your number +{{ auth.mobileNumber }}.
      </v-card-text>

      <v-card-actions>
        <v-container>
          <v-row>
            <v-text-field
              v-model="code"
              label="Verification code"
              hint="6-digit code"
              type="number"
            />
          </v-row>
          <v-row>
            <v-spacer />

            <v-btn
              color="green darken-1"
              text
              @click="cancelVerificationCode()"
            >
              Cancel
            </v-btn>

            <v-btn
              color="green darken-1"
              text
              @click="submitVerificationCode()"
            >
              Submit
            </v-btn>
          </v-row>
          <v-row>
            <div :style="{color: 'red'}">
              {{ error }}
            </div>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SmsAuth',

  data () {
    return {
      error: '',
      code: '',
      dialog: false,
      auth: {
        success: false,
        mobileNumber: '',
        verificationCode: '',
        generationDate: '',
        isAdmin: false
      }
    }
  },
  watch: {
    dialog (visible) {
      if (visible) {
        this.createVerificationCode()
        this.getMobileNumber()
      } else if (!this.auth.success) {
        this.$fire.auth.signOut()
      }
    }
  },
  methods: {
    showDialog () {
      this.dialog = true
    },
    createVerificationCode () {
      this.auth.verificationCode = Math.floor(Math.random() * (999999 - 100000) + 100000)
      this.auth.generationDate = new Date()
    },
    async getMobileNumber () {
      const currentUser = this.$fire.auth.currentUser
      const snapshot = await this.$fire.firestore.collection('users').where('uid', '==', currentUser.uid).get()
      snapshot.forEach((temp) => {
        const user = temp.data()
        this.auth.mobileNumber = user.mobile_number
        this.auth.isAdmin = user.isAdmin
      })
      this.sendSmsCode()
    },
    sendSmsCode () {
      const payload = {
        mobileNumber: this.auth.mobileNumber,
        message: 'Your verification code is #' + this.auth.verificationCode + '.'
      }

      fetch('https://m183.gibz-informatik.ch/api/sms/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'MgAxADkAOAA5ADkAOAA1ADkAMQAwADIAMgAxADUANQAzADcA'
        },
        body: JSON.stringify(payload)
      })
    },
    async submitVerificationCode () {
      const currentUser = this.$fire.auth.currentUser

      if (new Date(this.auth.generationDate.getTime() + (5 * 60000)) < new Date()) {
        this.error = 'Verification code expired.'
        // eslint-disable-next-line eqeqeq
      } else if (this.auth.verificationCode == this.code) {
        await this.$fire.firestore.collection('users').doc(currentUser.uid).update({
          smsAuth: true
        })

        this.auth.success = true
        this.dialog = false
        this.auth.verificationCode = ''
        if (this.auth.isAdmin) {
          this.$router.push('/admindashboard')
        } else {
          this.$router.push('/userdashboard')
        }
      } else {
        this.error = 'The verification code is wrong'
      }
    },
    cancelVerificationCode () {
      this.dialog = false
    }
  }
}
</script>
