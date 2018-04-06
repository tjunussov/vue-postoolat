/* eslint no-trailing-spaces: 2 */
// import Cleave from 'vue-cleave'
// import _ from 'lodash'
export default {
  name: 'demo',
  data () {
    return {
      pos: {
        srv: { mode: 'a1' },
        devices: [
          { text: 'Ingenico iPP320 - DDA-SHER', value: '48288502', no: '01' },
          { text: 'Ingenico iPP320 - KA-ASAA', value: '48333402', no: '02' },
          { text: 'Ingenico iPP320 - TEST', value: '#######', no: '03', selected: true }
        ]
      },
      kkm: '03',
      amount: 1000,
      menuList: '',
      inprogress: false,
      transactions: [],
      check: '',
      autoCheck: 1,
      input: '',
      result: {},
      output: 'Log...',
      mdPurchase: false,
      showModal: false,
      mdResult: false,
      tab: 0,
      logSize:30,
      url: 'http://localhost:7777/pos/command'
    }
  },
  created: function () {
    this.autoCheck = Number(localStorage.getItem('autoCheck'))
    this.$db.payments.reverse().limit(this.logSize).toArray().then(t => {
      this.transactions = t.map(function (e, i) {
        return {
          deleted: false,
          saved: true,
          error: '',
          json: e.json,
          created_: e.created_
        }
      })
    })
  },
  computed: {
    // kkm: function () {
    //   return _.find(this.pos.devices, {'selected': true})
    // },
    checkReal: function () {
      return this.check ? this.check : this.autoCheck
    }
  },
  watch: {
    autoCheck: function () {
      localStorage.setItem('autoCheck', this.autoCheck)
    },
    mdPurchase: function () {
      this.$emit('modal', this.mdPurchase)
    },
    mdResult: function () {
      this.$emit('modal', this.mdResult)
    }
  },
  methods: {
    update (rec) {
      console.log('update push', rec)
      this.transactions.unshift(rec)
    },
    remove (obj) {
      // Removing from local DB
      // Vue.set(this.transactions, 'attachments', [])
      this.$db.payments.delete(obj.created_).then(() => { obj.deleted = true })
      // this.$db.payments.where('created_').eq(obj.created_).delete().then(() => { obj.deleted = true })
      console.log('remove', obj.created_)
    },
    toggleTab (e) {
      // console.log(e.target.dataset.tab)
      this.tab = Number(e.target.dataset.tab)
    },
    send: function (cmd) {
      console.log('send', cmd)
      this.inprogress = true

      this.output = cmd

      var rec = {
        json: cmd,
        created_: new Date()
      }

      this.$http.post(this.url, cmd).then((data) => {
        data = data.body
        console.log('receieved response ', data)

        if (data && data.command) {
          this.output = data
          this.mdResult = true
          rec.json = data

          if ('PNG JRN SEL'.indexOf(data.command) < 0 && data.ResponseCode === '00') { // if found
            console.log('saving to db')
            this.$db.payments.add(rec).then(() => { rec.saved = true })
          } else {
            rec.saved = false
          }

          // Важно чтобы этот блок был в конце, ткак как происходит изменения данных cmd.no и autoCheck связанны
          if (data.command === 'PUR' && data.ResponseCode === '00') {
            if (this.autoCheck <= cmd.no) {
              this.autoCheck = ++cmd.no  // Increadsing Check Number is Success
            }
            this.check = ''
          }

        } else {
          console.error('Error response', data)
          rec.error = data
        }
      }).catch((e) => { 
        console.log('Failed',e)
        rec.error = e
      } )
      .then(function () {
        this.inprogress = false
        rec.deleted = false
        this.update(rec)
      })
    },
    report: function () {
      console.log('report', this.amount)
    },
    showCheck: function (json) {
      this.mdResult = true
      this.output = json

      console.log(JSON.stringify(json));

      this.check = Number(json.no)
      this.kkm = json.kkm

      if (json.amount) this.amount = Number(json.amount) / 100
    },
    manageDeviceList: function () {
      console.log('manageDeviceList')
    },
    parse: function () {
      console.log('Parse')
      this.mdPurchase = true
      this.$emit('open', this.mdPurchase)
    }
  },
  events: {
    close: function (state) {
      console.log('closed emited inside', state)
    }
  }
}