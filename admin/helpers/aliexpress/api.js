const ApiClient = require('./nodejs').ApiClient;
const { appKey, appSecret } = require('./config');

var client = new ApiClient({
                            'appkey': appKey,
                            'appsecret': appSecret,
                            'REST_URL':'http://gw.api.taobao.com/router/rest'
                            });

client.execute('aliexpress.affiliate.productdetail.get',
              {
                  // 'product_ids': '1005002485985624',
                  'product_ids': '4000636223836',
                  'target_currency': 'EUR',
              },
              function (error,response) {
                  if(!error)
                    console.log(JSON.stringify(response, null, '  '))
                  else
                    console.log(error);
              })

