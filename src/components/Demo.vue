<template lang="pug">
div(style="height:100%;")
  .row(style="height:100%;")
    .col-sm-7.scroll-wrapper
      h1 POS Demo

      //- .form-group.row.mt-5
      //-   label.col-sm-2.col-form-label.text-right Format
      //-   .col-sm-8
      //-     .btn-group
      //-       button(type="button").btn.btn-default {{kkm.text}}
      //-       button(type="button",data-toggle="dropdown",aria-haspopup="true",aria-expanded="false").btn.dropdown-toggle.dropdown-toggle-split
      //-         span.sr-only Toggle Dropdown
      //-       .dropdown-menu
      //-         a.dropdown-item(v-for="d in pos.devices") {{d.text}}
      //-         .dropdown-divider
      //-         a.dropdown-item(@click="manageDeviceList") Manage
      
      .form-group.row.mt-4
        label.col-sm-2.col-form-label.text-right Server
        .col-sm-8 
          input.form-control(v-model="url",readonly)
        .col-sm-2
          button.btn.btn-secondary(@click="mdResult=true; output=false") Demo
      .form-group.row
        label.col-sm-2.col-form-label.text-right POS No
        .col-sm-8
          select.form-control(v-model="kkm")
            option(v-for="d in pos.devices",v-bind:value="d.no") {{d.no}} - {{d.text}}
        .col-sm-2
            button.btn(title="PNG Проверка связи между ККМ и TRPOS",@click="send({command: 'PNG', kkm: kkm})") Ping
      //- .form-group.row
      //-   label.col-sm-2.col-form-label.text-right TRPOSX
      //-   .col-sm-8 
      //-     .form-control Running
          
      hr
      fieldset(:disabled="inprogress",v-bind:class="result")
        .form-group.row
          label.col-sm-2.col-form-label.text-right No
          .col-sm-4.input-group
            span.input-group-addon {{checkReal}}
            input.form-control(:placeholder="'Auto (' + autoCheck + ')'",v-model="check")
          label.col-sm-1.col-form-label Sum
          .col-sm-3
            input.form-control.text-right(type="number",placeholder="0",v-model.number="amount")
          .col-sm-2

        .form-group.row.mb-3
          label.col-sm-2.col-form-label.text-right Oper            
          .col-sm-10
            ul.nav.nav-tabs(@click="toggleTab($event)")
              li.nav-item
                a.nav-link(:class="{'active': tab == 0}",data-tab="0",href="#") Sale
              li.nav-item
                a.nav-link(:class="{'active': tab == 1}",data-tab="1",href="#") Auth
              li.nav-item
                a.nav-link(:class="{'active': tab == 2}",data-tab="2",href="#") Cash
              li.nav-item
                a.nav-link(:class="{'active': tab == 3}",data-tab="3",href="#") Bonus
              li.nav-item
                a.nav-link(:class="{'active': tab == 4}",data-tab="4",href="#") Card
              li.nav-item
                a.nav-link(:class="{'active': tab == 5}",data-tab="5",href="#") Menu
              li.nav-item
                a.nav-link(:class="{'active': tab == 6}",data-tab="6",href="#") Settings

        .tab-content(style="min-height:65px;")
          .tab-pane(:class="{'active': tab == 0}")
            .form-group.row
              label.col-sm-2.text-right
              .col-sm-8
                button.btn.btn-success.mr-1(@click="send({command: 'PUR', kkm: kkm, amount: amount, no: checkReal})") Purchase
                button.btn.btn-warning.mr-1(@click="send({command: 'REF', kkm: kkm, amount: amount, no: check, RNN:output.RNN })") Refund 
                //- InvoiceNumber и RRN
                button.btn.btn-grey(@click="send({command: 'VOI', kkm: kkm, no: check})") Void
              .col-sm-2
                button.btn.btn-info(title="STL Сверка итогов с банковским хостом, закрытие банковского дня",@click="send({command: 'STL', kkm: kkm, no: check})") Сверка
          .tab-pane(:class="{'active': tab == 1}")
            .form-group.row
              label.col-sm-2.text-right
              .col-sm-8
                button.btn.btn-success.mr-1(title="AUT Блокирование средств на счете клиента",@click="send({command: 'AUT', kkm: kkm, amount: amount, no: checkReal})") Block
                button.btn.btn-warning.mr-1(title="AUH Списание средств с карточного счета клиента в оплату товаров/услуг.",disabled,@click="send({command: 'AUH', kkm: kkm, amount: amount, no: checkReal})") Списание
                button.btn.btn-warning.mr-1(title="CMP Окончательный расчет после предварительной или голосовой авторизации",@click="send({command: 'CMP', kkm: kkm})",disabled) Расчет 
                //- AuthorizationID или RRN,InvoiceNumber и TransactionID
                
                small.form-text.text-muted.mt-2 Преавторизация, предварительное блокирование средств на карте
              .col-sm-2
                button.btn.btn-grey(title="VAU Разблокировка средств на карточном счету",@click="send({command: 'VAU', kkm: kkm, amount: amount, no: check})",disabled) Void
                //- Invoice Number, RRN, TransactionID, DateTime
                


          .tab-pane(:class="{'active': tab == 2}")
            .form-group.row
              label.col-sm-2.text-right
              .col-sm-8
                button.btn.btn-success.mr-1(title="CSH Списание средств с карточного счета клиента и выдача наличными",@click="send({command: 'CSH', kkm: kkm, amount: amount, no: checkReal})") Выдача 
                button.btn.btn-warning.mr-1(title="CRE Пополнение карточного счета клиента",@click="send({command: 'CRE', kkm: kkm, amount: amount, no: checkReal})") Пополнение
                small.form-text.text-muted.mt-2 Для пунктов выдачи валюты или денег
              .col-sm-2
                button.btn(@click="send({command: 'BAL', kkm: kkm})") Баланс
          .tab-pane(:class="{'active': tab == 3}")
            .form-group.row
              label.col-sm-2
              .col-sm-8
                button.btn.btn-success.mr-1(title="Транзакция по бонусам",@click="send({command: 'XTR', kkm: kkm, amount: amount, no: checkReal})") Оплата
                button.btn.btn-warning.mr-1(title="Возврат по карте лояльности",@click="send({command: 'XRE', kkm: kkm, amount: amount, no: check})") Возврат
                small.form-text.text-muted.mt-2 Программа лояльности, Бонусы
              .col-sm-2
                button.btn(@click="send({command: 'XBA', kkm: kkm})") Баланс
          .tab-pane(:class="{'active': tab == 4}")
            .form-group.row
              label.col-sm-2
              .col-sm-8
                button.btn.btn-success.mr-1(title="ACT Активация предоплаченной карты",@click="send({command: 'ACT', kkm: kkm})") Активация
              .col-sm-2
                button.btn(title="VER Операция чтения магитной или чиповой карты на считывателе POS-терминала ",@click="send({command: 'VER', kkm: kkm})") Чтение
          .tab-pane(:class="{'active': tab == 5}")
            .form-group.row
              label.col-sm-2.col-form-label.text-right 
              .col-sm-8
                input.form-control(type="text",placeholder="Menu List...",v-model="menuList")
              .col-sm-2
                    button.btn.btn-warning.mr-1(title="SEL Выбор из меню",@click="send({command: 'SEL', kkm: kkm, no: check, SelectionList: menuList})") Меню
                
            .form-group.row
              label.col-sm-2.col-form-label.text-right
              .col-sm-8 
                
          .tab-pane(:class="{'active': tab == 6}")
            .form-group.row
              label.col-sm-2.col-form-label.text-right 
              .col-sm-10.input-group
                select.form-control(v-model="pos.srv.mode")
                  option(value="a1") Тест ПинПада
                  option(value="a2") Тест Процессинга
                .input-group-btn
                    button.btn.btn-secondary(@click="send({command: 'SRV', kkm: kkm, fn:pos.srv.mode })") Диагностика
                
            .form-group.row
              label.col-sm-2.col-form-label.text-right Утилиты
              .col-sm-8
                button.btn.btn-success.mr-1(title="JRN Запрос журнальной записи POS-терминала",@click="send({command: 'JRN', kkm: kkm, no: check})") Журнал 
              .col-sm-2
                button.btn(title="Подтверждение операции",@click="send({command: 'CLR', kkm: kkm })") Confirm

  
      .form-group.row.scrollcontainer
        .col-sm-2
        .col-sm-10
          .scrollable
              ul.transactions.list-group
                li.tr.list-group-item.list-group-item-action.flex-column.align-items-start(v-for="t in transactions",:class="{deleted:t.deleted,selected:t.json == output,saved:t.saved,error:t.error}",@click="showCheck(t.json)")
                  .d-flex.w-100.justify-content-between
                    h5.header(:class="t.json.command")
                      //- icon(name="beer")/ 
                      i.fa.fa-fax.mr-1
                      span.mr-3 {{t.json.kkm}}
                      | {{t.json.command}} {{t.json.no | number}}
                      i.fa.fa-save.cross.mx-1(v-if="!t.saved",title="Not Saved")
                      //- button.remove.ml-2.btn.btn-sm.btn-danger(@click="remove(t)",tabindex="2") Delete
                      button.ml-3.close.btn-link(v-if="!t.deleted",@click.prevent.stop="remove(t)",tabindex="2"): span &times;
                    h5.text-muted 
                      span.amount(v-if="t.json.amount") {{t.json.amount | amount }} ₸
                      //- button.ml-3.close.btn-link(@click="remove(t)",tabindex="2"): span &times;
                  p(v-if="!(t.deleted||t.error)") {{t.json.VisualHostResponse}} ({{t.json.ResponseCode}})
                  p(v-if="t.error") {{t.error.status}}
                  small.text-muted(v-if="!t.deleted") {{t.created_ | date('YYYY-MM-DD hh:mm:ss')}} 
      .row
        .col-sm-2
        .col-sm-10.text-right
          small.text-muted Max number of records {{logSize}}

    .col-sm-5
        .icon-terminal
        .scrollable(style="top:170px; left:120px; right:132px; bottom:auto; height:140px; ")
            div(:inner-html.prop="output | json2html('json')",style="font-size:10px;")


  modal(v-if="showModal",@close="showModal = false")
    h3(slot="header") Check
    div(slot="body",:inner-html.prop="selectedCheck | json2html('json')")


  .modal#purchaseModal(:class="{ 'show': mdPurchase }",v-if="mdPurchase",v-bind:style="{ 'display': mdPurchase?'block':'none' }")
    .modal-dialog
      .modal-content
        .modal-header
          h5.modal-title Оплата
          button.close(@click="mdPurchase=false"): span &times;
        .modal-body
          p К Оплате Сумма {{amount}}.
        .modal-footer
          button.btn.btn-primary(@click="command('PUR')") Продолжить
          button.btn.btn-secondary(@click="mdPurchase=false") Отмена

  demoModal(:class="{ 'show': mdResult }",v-if="mdResult",:input="output",@close="mdResult=false",v-bind:style="{ 'display': mdResult?'block':'none' }")

</template>

<style lang="stylus" scoped>
   
  h1 
    font-weight 100
    color #000
    
  hr
    width 100%
  
  fieldset.error, .transactions .tr.error  
    background-color rgba(255,0,0,0.05)
    
  fieldset.error, .transactions .tr.error p
    color #f00

  .icon-terminal
    background url(./../assets/devices_icons_ipp320.svg) no-repeat
    background-size 900px 1200px
    background-position -150px 50px
    height 800px
    width 500px
  
  .transactions
    // font-family monospace
    cursor pointer
    
  .transactions .tr
    transition 0.1s all ease-in
    
  .transactions .PUR
    color #5cb85c !important
    
  .transactions .REF
    color #c9302c
  
  .transactions .VOI
    color #f0ad4e
    
  .transactions .PNG, .transactions .JRN, .transactions .SE
    color #aaa
      
  // .transactions .tr:not(:first-child):not(:hover)
  //   opacity 0.7
    
  .transactions .tr.deleted
    text-decoration line-through
    color #ccc
    
  .transactions .tr.selected
    border-color #3297FD
    margin-bottom 0
    
  .tr .header
    margin-bottom 0px !important
    
    
  .cross 
    position relative
    
  .cross::after
    content ''
    position absolute
    height 2px
    width 150%
    top 50%
    left 0
    margin-left -3px
    background #000

  .cross::before
    transform rotate(45deg)
 
  .cross::after
    transform rotate(-45deg)
    
  .tr:not(:hover) .close
    visibility hidden
  
  .tr .amount
    font-weight normal
  
  // .transactions .tr.saved .header
  //   text-decoration underline
    
  .transactions th
    font-weight normal
    background-color #f5f5f5
    text-align center
  
</style>

<style lang="stylus">

  /********* scroller ************/
    
  .navbar
    position absolute
    width 100%
    z-index 100
    
  .layout
    display table
    box-sizing border-box
    padding 100px 0
    
  html, body, #app, .layout
    height 100%
    
  .scroll-wrapper
    display flex
    flex-direction column
    height 100%
    min-height 100%
  
  .scrollcontainer
    position relative
    flex 1
    
  .scrollable 
    position:absolute; 
    top:0; 
    bottom:0; 
    left:0; 
    right:0; 
    overflow:auto;
    border 1px solid #f0f0f0
    
  .scrollable::-webkit-scrollbar {  width: 3px; height: 3px;}
  .scrollable::-webkit-scrollbar-thumb { background: rgba(100,100,100,.3); }
</style>

<script src="./DemoController.js"></script>


