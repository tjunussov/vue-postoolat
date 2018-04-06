<template>
  <div id="app">
    <nav class="navbar navbar-fixed-top navbar-toggleable-md navbar-inverse bg-inverse">
      
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand" href="/">
          <img src="./assets/logo.png" height="28" class="mr-2">
          POSTOOLAT IPP
        </a>
        <!-- <div class="container"> -->
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/demo">Demo</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/decoder">Decoder</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/settings">Settings</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/manual">Manual</a>
            </li>
          </ul>
        </div>
        <!-- </div> -->
    </nav>
    <div class="container layout">
      <router-view v-on:modal="modal"></router-view>
    </div>
    <footer class="footer">
      <div class="container text-muted">
        © 2017 SMARTPOS Inc. All Rights Reserved
      </div>
    </footer>
    <div class="modal-backdrop show" v-if="modalOpen"></div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      modalOpen: false,
      title: 'POSTOOLAT IPP - Подключение SMARTPOS к выносным PINPAD или POS Терминалам'
    }
  },
  ready () {
    this.$on('modal', () => {
      console.log('event was heard')
    })
  },
  components: {
    // Components go here
  },
  methods: {
    modal: function (state) {
      this.modalOpen = state
      // console.log('modal event', state)
    }
  },
  watch: {
    modalOpen: function (toggle) {
      var className = 'modal-open'
      if (toggle) {
        document.body.classList.add(className)
      } else {
        document.body.classList.remove(className)
      }
    }
  }
}
</script>

<style>
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  html {
    position: relative;
    min-height: 100%;
  }
  button { cursor: pointer; }
  body {
    /* Margin bottom by footer height */
    /*margin-bottom: 60px;*/
  }
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    /* Set the fixed height of the footer here */
    height: 60px;
    line-height: 60px; /* Vertically center the text there */
    background-color: #f5f5f5;
  }

  /*.navbar { margin-bottom: 50px; }*/

  p {
    margin: 0em;
  }

  p.lead {
    font-weight: 500;
    margin-bottom: 1em;
    color: #888;
  }

  h1, h2 {
    font-weight: 200;
  }

  h3, h4 {
    margin-top: 1em;
    font-weight: 700;
  }

  textarea.code,code {
    font-family:monospace;
    padding:7px 10px;
    display:block;
    word-wrap:break-word;
    height:100%;
  }
</style>
<style lang="stylus">
  .tjson
    font-family monospace
  .tjson.group .tjson.group
    margin-left 26px
  .tjson.json .tjson.group:after
    content '}'
  .tjson.json .tjson.group:before
    content '{'
    
  .tjson.key
     font-weight bold
     display inline-block
     min-width 50px
     margin-left 26px
  .tjson.json .tjson.key:after 
    content ':'
  .tjson.val
     color green
  .tjson.val:after 
     content ','
</style>

