<template>
  <div class="home">

    <h1>BLE TLV Decoder</h1>
    EMV Coding format

    <div class="form-group row mt-5">
      <label class="col-sm-1  col-form-label text-right">Harware/OS</label>
      <div class="col-sm-5">
        <select v-model="profile" class="form-control">
          <option value="TRPOS">Ingenico IPP - Intelia 2 - TRPOS</option>
          <option>Default - Generic ID</option>
        </select>
      </div>
      <div class="col-sm-6">
        <button class="btn" v-on:click="parse">Test</button>
        <button class="btn" v-on:click="parse">Send</button>
        <button class="btn" v-on:click="parse">Parse</button>
      </div>
    </div>


    <div class="form-group row">
        <div class="col-sm-6">
          <textarea class="form-control code" v-model="input" rows="10" cols="50" placeholder="Insert BLE TLV Commands here"></textarea>
        </div>
        <div class="col-sm-6">
          <!-- <textarea v-model="output" rows="10" cols="50" placeholder="Converted output"></textarea> -->
          <code class="form-control text-left">
            <div  v-for="(value, key) in tlv">
              {{ key }} : {{ value }}
            </div>
          </code>
        </div>
    </div>

  </div>
</template>

<script>
/* global parseTags */

export default {
  name: 'Decoder',
  data () {
    return {
      tlv: {Output: 'text...'},
      output: '',
      input: '',
      profile: 'TRPOS'
    }
  },
  methods: {
    parse: function () {
      this.tlv = parseTags(this.input)
      console.log(this.tlv)
      this.output = JSON.stringify(this.tlv)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  /*textarea.code,code
    font-family monospace
    padding 5px
    border 1px solid
    display block
    word-wrap break-word
    height 100%*/
</style>
