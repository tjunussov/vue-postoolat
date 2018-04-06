<template lang="pug">
.modal#resultModal
  .modal-dialog
    .modal-content
      .modal-header.text-white(:class="output.ResponseCode | decode('00','bg-success','B8','bg-danger','bg-inverse')")
        h5.modal-title Операция {{output.command}} - Выполнена {{output.ResponseCode | decode('00','Успешно','B8','с Ошибкой','с Ошибкой '+output.ResponseCode)}} 
        button.close(@click="$emit('close')"): span &times;
      .modal-body.my-3.px-5(:class="{'text-danger': output.ResponseCode != '00'}")
        template(v-if="output.ResponseCode==='00'")
          template(v-if="output.command==='PUR'")
            h2 Оплата №{{output.no | number}} 
              | на сумму 
              | {{output.amount | amount}} ₸
              | {{output.ResponseCode == '00'?' принята' : 'не принята'}} !

            hr
            div.text-center
              p Торговая Точка {{output.MerchantNo | decode('398000048288502','DDA-SHER','398000048333402','KA-ASAA')}}
              h5.my-3 ОПЛАТА
            samp.row.no-gutters
              .col-sm-6 
                div ТЕРМИНАЛ: {{output.TerminalID}}/{{output.kkm}}
                div AID: {{output.ApplicationID}}
                div <b>{{output.PAN}}</b>
                div ЧЕК No: {{output.InvoiceNumber}}/{{output.no}}
                div Дата: {{output.Date}}
                div RNN {{output.RRN}}
                div КОД ОТВЕТА:{{output.ResponseCode}} 
                  span(v-show-label="output.Approve") APPROVE: %s

              .col-sm-6.text-right
                div {{output.ApplicationLabel}}
                div ICC:{{output.IssuerName}}
                br/
                div Пакет: {{output.BatchNo}}
                div Время: {{output.Time}}
                div КОД АВТ.: {{output.AuthorizationID}}
      
              //- 'ProcessingCode': '000000',
              //- 'TVR': '0000008000',
              //- 'TC': '262168E2B9B60653',
              //- 'DateTime': '\u001c\u001cTEST/CLI\u0000\u0000',
            hr
            p(v-if="output.POSEntryMode") Метод ввода 
              b {{output.POSEntryMode | decode('051','Пинкод','072','Безконтактно')}}

            p(v-if="output.Approve") Транзакция <b>{{output.Approve | decode('Y','Одобрена','D','Отклонена',output.Approve)}}</b>
            p(v-if="output.CardholderVerificationCharacter") Режим подтверждения <b>{{output.CardholderVerificationCharacter | decode('P','PIN-код проверялся','S','Необходима проверка подписи','C','проверялся pin-код и требуется проверка подписи','Проверка не требуется')}}</b>
            
            hr
            pre.px-4 {{output.Receipt}}
          template(v-else-if="output.command==='SRV'")
            p Диагностика
              b No {{output.ERN | number}}
          template(v-else-if="output.command==='PNG'")
            p Ping
              b No {{output.kkm}} успешен
          template(v-else)
            p Другие операции {{output.command}}
          div(v-show-label="output.VisualHostResponse") Ответ <b>%s</b>
        template(v-else)
          div Транзакция: {{output.no  | number}} 
          div(v-show-label="output.VisualHostResponse") Ответ <b>%s</b>
          span(v-show-label="output.Approve") APPROVE: %s
          div TransactionAmount: {{output.amount  | amount}} 
        
      .modal-footer
          button.btn.btn-secondary(@click="$emit('close')") Ok
</template>

<style lang="stylus">
</style>

<script>
export default {
  name: 'demoModal',
  props: ['input'],
  computed: {
    output: function () {
      if (!this.input) {
        return {
          'MessageID': 'PUR',
          'command': 'PUR',
          'ECRnumber': '01',
          'kkm': '01',
          'ERN': '0000000111',
          'no': '0000000111',
          'ResponseCode': '00',
          'amount': '000000004400',
          'TransactionAmount': '    \u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000',
          'PAN': '5***********8871',
          'InvoiceNumber': '452141',
          'AuthorizationID': '810713',
          'Date': '0508',
          'Time': '0048',
          'IssuerName': 'ECMC    ',
          'MerchantNo': '398000022745801',
          'ProcessingCode': '000000',
          'POSEntryMode': '072',
          'POSConditionCode': '00',
          'CardholderVerificationCharacter': ' ',
          'RRN': '721701026720',
          'TVR': '0000008000',
          'ApplicationID': 'A0000000041010',
          'TC': '737F46C741F41A19',
          'TerminalID': '22745801',
          'BatchNo': '000044',
          'ApplicationLabel': 'MasterCard      ',
          'Receipt': '\r\n\r\n\r\n\r\n\r\n\r\n                 ОПЛАТА\r\n          ЧЕК: 452141/0000000111\r\n\r\nДАТА: 05 Авг 17             ВРЕМЯ: 00:48\r\nНОМЕР ТЕРМИНАЛА:                22745801\r\nТОРГОВАЯ ТОЧКА:          398000022745801\r\n\r\nECMC                    КОД АВТ.: 810713\r\n5***********8871       RRN: 721701026720\r\nСРОК ДЕЙСТВИЯ:   /         ПАКЕТ: 000044\r\n\r\nИТОГО\r\n                                   99.00\r\n                 ОДОБРЕНО\r\n             КОД ОТВЕТА: 00\r\n\r\n\r\n\r\nX_______________________________________\r\n            (Подпись клиента)\r\n\r\n\r\nX_______________________________________\r\n            (Подпись кассира)\r\n\r\n\u0015\r\n\r\n\r\n\r\n\r\n\r\n                 ОПЛАТА\r\n          ЧЕК: 452141/0000000111\r\n\r\nДАТА: 05 Авг 17             ВРЕМЯ: 00:48\r\nНОМЕР ТЕРМИНАЛА:                22745801\r\nТОРГОВАЯ ТОЧКА:          398000022745801\r\n\r\nECMC                    КОД АВТ.: 810713\r\n5***********8871       RRN: 721701026720\r\nСРОК ДЕЙСТВИЯ:   /         ПАКЕТ: 000044\r\n\r\nИТОГО\r\n                                   99.00\r\n                 ОДОБРЕНО\r\n             КОД ОТВЕТА: 00\r\n\r\n\r\n\r\nX_______________________________________\r\n            (Подпись клиента)\r\n\r\n\r\nX_________________________________'
        }
      } else {
        return this.input
      }
    }
  }
}

    //   'MessageID': 'PUR',
    //   'ECRnumber': '01',
    //   'ERN': '0000000018',
    //   'ResponseCode': '00',
    //   'TransactionAmount': '000000025500',
    //   'PAN': '5***********8871',
    //   'InvoiceNumber': '452129',
    //   'AuthorizationID': '810689',
    //   'Date': '0308',
    //   'Time': '0002',
    //   'IssuerName': 'ECMC    ',
    //   'MerchantNo': '398000022745801',
    //   'ProcessingCode': '000000',
    //   'POSEntryMode': '051',
    //   'POSConditionCode': '00',
    //   'CardholderVerificationCharacter': 'P',
    //   'RRN': '721501004669',
    //   'TVR': '0000008000',
    //   'ApplicationID': 'A0000000041010',
    //   'TC': '89542090027BC9B7',
    //   'TerminalID': '22745801',
    //   'BatchNo': '000043',
    //   'ApplicationLabel': 'MasterCard      ',
    //   'VisualHostResponse': 'ОДОБРЕНО 810689',
    //   'Approve': 'Y',
    //   'Flags': '-',
    //   'DateTimeYYMMDDHHmmss': '\u001c\u001cTEST/CLI\u0000\u0000',
    //   'TransactionAmount#2': '000000000000',
    //   'chuhan': {
    //     'MessageID': 'PUR',
    //     'ECRnumber': '01',
    //     'ERN': '0000000018',
    //     'ResponseCode': '00'
    //   }

    //   'MessageID': 'PUR',
    //   'command': 'PUR',
    //   'ECRnumber': '01',
    //   'kkm': '01',
    //   'ERN': '0000000111',
    //   'no': '0000000111',
    //   'ResponseCode': 'B9',
    //   'TransactionAmount1': '000000004400',
    //   'amount': '000000004400',
    //   'VisualHostResponse': 'Транзакция с таким но',
    //   'Approve': 'N'

</script>


