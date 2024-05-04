var winston = require('winston');


var winstonLogger = new winston.Logger({
    transports: [
      // new winston.transports.File({
      //   level: 'info',
      //   filename: './logs/all-logs.log',
      //   handleExceptions: true,
      //   json: true,
      //   maxsize: 5242880, //5MB
      //   maxFiles: 5,
      //   colorize: false
      // }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: function() {
          let ms = new Date();
          ms = ms.getMilliseconds();
          ms = ('0' + ms).slice(-3);
          let date = new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().substring(0,20) + ms + 'Z';
          return  date;
        },
        formatter: function(options) {
          switch (options.level) {
            case 'error' :
              options.message += " error : ";
              break;
            default : //debug, info
              options.message += " : ";
              break;
          }
          return winston.config.colorize(options.level, options.level.toUpperCase()) + ': ' + options.timestamp() 
            + ' ' + options.message + (options.meta.body || options.meta.stack || "");
        }
      })
    ],
    exitOnError: false
  });

  var Logger = {
    log: function(type, tag, body) {
      if (process.env.NODE_ENV != 'test')
        winstonLogger.log(type, tag, {body: this.formatObject(body)});
    },
    formatObject: function(obj) {
      if ((typeof obj) == 'object' && !Array.isArray(obj) && obj !== null) {
        obj = JSON.parse(JSON.stringify(obj));
        if (obj.password) {
          obj.password = '[HIDDEN]';
        }
        if (obj.privateKey) {
          obj.privateKey = '[HIDDEN]';
        }
        if (obj.account_number) {
          var mask = obj.account_number.toString().replace(/.(?=.{4})/g, '*');
          obj.account_number = mask;
        }
        if (obj.accountNo) {
          var mask = obj.accountNo.toString().replace(/.(?=.{4})/g, '*');
          obj.accountNo = mask;
        }
        if (obj.sourceAccount) {
          var mask = obj.sourceAccount.toString().replace(/.(?=.{4})/g, '*');
          obj.sourceAccount = mask;
        }
        if (obj.file) {
          obj.file = '[HIDDEN]';
        }
        if (obj.accountNumber) {
          var mask = obj.accountNumber.toString().replace(/.(?=.{4})/g, '*');
          obj.accountNumber = mask;
        }
        if (obj.session_id) {
          var mask = obj.session_id.toString().replace(/.(?=.{4})/g, '*');
          obj.session_id = mask;
        }
        if (obj.payments) {
          var debit = obj.payments.debitAccount.toString().replace(/.(?=.{4})/g, '*');
          obj.payments.debitAccount = debit;
          var credit = obj.payments.creditAccount.toString().replace(/.(?=.{4})/g, '*');
          obj.payments.creditAccount = credit;
        }
        if (obj.message == 'Successfully get Partner.') {
          obj.record.username = '[HIDDEN]';
          obj.record.password = '[HIDDEN]';
          obj.record.salt = '[HIDDEN]';
          obj.record.secretVersion = '[HIDDEN]';
          obj.record.privateKey = '[HIDDEN]';
          obj.record.cipherKey = '[HIDDEN]';
          obj.record.accountNumber = obj.record.accountNumber.toString().replace(/.(?=.{4})/g, '*');
        }
        if (obj.sourceAccountNumber) {
          var mask = obj.sourceAccountNumber.toString().replace(/.(?=.{4})/g, '*');
          obj.sourceAccountNumber = mask;
        }
        if (obj.targetAccountNumber) {
          var mask = obj.targetAccountNumber.toString().replace(/.(?=.{4})/g, '*');
          obj.targetAccountNumber = mask;
        }
        if (obj.debits) {
          for (var i in obj.debits){
            var debit = obj.debits[i].accountNumber.toString().replace(/.(?=.{4})/g, '*');
            obj.debits[i].accountNumber = debit;
            var credit = obj.credits[i].accountNumber.toString().replace(/.(?=.{4})/g, '*');
            obj.credits[i].accountNumber = credit;
          }
        }
        if (obj.cards) {
          for (var i in obj.cards){
            var accountNumber = obj.cards[i].account.number.toString().replace(/.(?=.{4})/g, '*');
            obj.cards[i].account.number = accountNumber;
            obj.cards[i].encryptedCardNumber = '[HIDDEN]';
          }
        }
        if (obj.encryptedCardNumber) {
           obj.encryptedCardNumber = '[HIDDEN]';
        }
        if (obj.debit && obj.credit) {
            var mask = obj.debit.account.number.toString().replace(/.(?=.{4})/g, '*');
            obj.debit.account.number = mask;
            var mask = obj.credit.account.number.toString().replace(/.(?=.{4})/g, '*');
            obj.credit.account.number = mask;
        }
        if (obj.records && Array.isArray(obj.records) && obj.records.length > 0) {
          obj.records = [{length: obj.records.length}];
        }
        if (obj.data && Array.isArray(obj.data) && obj.data.length > 0) {
          obj.data = [{length: obj.data.length}];
        }
        obj = JSON.stringify(obj);
      }
      if (Array.isArray(obj) && obj.length > 0) {
        obj = JSON.stringify(obj);
        // for (var i in obj){
        //   obj = obj[i]
        //   var array = [];
        //   Object.keys(obj).forEach(function(key) {
        //     array.push({field : key, value: obj[key]})
        //   })
        //   obj = array.slice(0,3);
        //   obj = JSON.stringify(obj);
        // }
      }
      return obj;
    },
    api: function(tag, body){
      var axios = require('axios');
      var options = {
        method: 'POST',
        url: getConfig('apic', 'apiLoggerUrl'),
        headeres: {
          contentType: 'application/json'
        },
        json: {
            tag: tag,
            header: {},
            query: {},
            body: body
        }
      }
      axios(options).then((response)=>{}).catch((error=>{}));
    }
  }

  module.exports = Logger;
