/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */


define([
  'N', './CryptoJs'
],
  function (N, CryptoJs) {

    const Https = N.https;
    const Runtime = N.runtime;
    const Log = N.log;

    class TBA {

      constructor(setupData) {
        this.COMPANYID = Runtime.accountId.toUpperCase();
        this.CONSUMER_KEY = setupData.CONSUMER_KEY;
        this.CONSUMER_SECRET = setupData.CONSUMER_SECRET;
        this.NONCE = this.__getNonce(32);
        this.OA_VERSION = setupData.OA_VERSION;
        this.B_URL = setupData.BASE_URL;
        this.METHOD = setupData.METHOD;
        this.TIMESTAMP = Math.round(+new Date() / 1000);
        this.TOKEN_ID = setupData.TOKEN_ID;
        this.TOKEN_SECRET = setupData.TOKEN_SECRET;
        this.RESTLET_ID = setupData.RESTLET_ID;
        this.RESTLET_DEPLOYID = setupData.RESTLET_DEPLOYID;
        this.RESTLET_EXTERNAL_URL = setupData.RESTLET_EXTERNAL_URL;
      }

      async execute() {
        let authorization = this.getAthorization();
        let responseBody = await this.makeRequest(authorization);
        return responseBody;
      }

      async makeRequest(authorization) {
        let headers = ({
          'Authorization': authorization
        });
        let response = await Https.get.promise({
          url: this.RESTLET_EXTERNAL_URL,
          headers: headers,
          body: {}
        });
        return JSON.parse(response.body);
      }

      getAthorization() {
        let data = '';
        data = data + 'deploy=' + this.RESTLET_DEPLOYID + '&';
        data = data + 'oauth_consumer_key=' + this.CONSUMER_KEY + '&';
        data = data + 'oauth_nonce=' + this.NONCE + '&';
        data = data + 'oauth_signature_method=' + 'HMAC-SHA256' + '&';
        data = data + 'oauth_timestamp=' + this.TIMESTAMP + '&';
        data = data + 'oauth_token=' + this.TOKEN_ID + '&';
        data = data + 'oauth_version=' + this.OA_VERSION + '&';
        data = data + 'script=' + this.RESTLET_ID;

        var encodedData = encodeURIComponent(data);
        var completeData = this.METHOD + '&' + encodeURIComponent(this.B_URL) + '&' + encodedData;
       
        var hmacsha256Data = CryptoJs.HmacSHA256(completeData, this.CONSUMER_SECRET + '&' + this.TOKEN_SECRET);
        var base64EncodedData = CryptoJs.enc.Base64.stringify(hmacsha256Data);
        var oauth_signature = encodeURIComponent(base64EncodedData);

        var OAuth = 'OAuth ';
        OAuth = OAuth + 'oauth_signature="' + oauth_signature + '", ';
        OAuth = OAuth + 'oauth_version="' + this.OA_VERSION + '", ';
        OAuth = OAuth + 'oauth_nonce="' + this.NONCE + '", ';
        OAuth = OAuth + 'oauth_signature_method="HMAC-SHA256", ';
        OAuth = OAuth + 'oauth_consumer_key="' + this.CONSUMER_KEY + '", ';
        OAuth = OAuth + 'oauth_token="' + this.TOKEN_ID + '", ';
        OAuth = OAuth + 'oauth_timestamp="' + this.TIMESTAMP + '", ';
        OAuth = OAuth + 'realm="' + this.COMPANYID + '"';

        return OAuth;
      }

      __getNonce(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }
    }


    return {
      TBA
    }
  });

