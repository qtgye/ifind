const { JSDOM } = require('jsdom');
const got = require('got');
const tunnel = require('tunnel');

const userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36';
const requestHeaders = {
  'User-Agent': userAgent,
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'en-US,en;q=0.9,la;q=0.8,fil;q=0.7',
  'cache-control': 'max-age=0',
  'rtt': '50',
  'sec-ch-ua': '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
}

const getProxyList = async () => {
  const countries = [ 'de' ];
  const servers = [];

  await Promise.all(countries.map(async (country) => {
    const response = await got(`https://www.proxynova.com/proxy-server-list/country-${country}/`);
    const dom = new JSDOM(response.body);
    const [...rows] = dom.window.document.querySelectorAll('tr[data-proxy-id]');
    // Filter only servers with highest uptimes
    const upServers = rows.filter(row => row.querySelector('.uptime-high, .uptime-medium'));
    const proxyServers = upServers.map(row => {
      const [ hostCell, portCell, lastCheck, speed, uptimeCell ] = [...row.children];
      const [ host ] = hostCell.textContent.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
      const port = portCell.textContent.trim();
      const uptime = uptimeCell.textContent.match(/\d+%/);
      return { host, port, uptime };
    });
    servers.push(...proxyServers);
  }));

  return servers;
};

const proxiedRequest = async (url) => {
  const usedIndices = [];
  const servers = await getProxyList();

  while ( servers.length ) {
     let currentIndex = Math.floor(Math.random() * servers.length);

     while ( usedIndices.includes(currentIndex) ) {
      currentIndex = Math.floor(Math.random() * servers.length);
     }

     usedIndices.push(currentIndex);
     const { host, port, uptime } = servers[currentIndex];

     console.log(`Trying proxy server: ${host}:${port} (${uptime} uptime)...`);

     const headers = {
       ...requestHeaders,
       'Origin': url,
        'Referer': url,
        'Referrer': url,
     };

    try {
      const request = got(url, {
        headers,
        agent: {
          https: tunnel.httpsOverHttp({
            proxy: { host, port },
          }),
        },
      });
      const p2 = new Promise((resolve, reject) => {
        setTimeout(() => {
          request.cancel();
          resolve('');
        }, 10 * 1000);
      });

      const response = await Promise.race([request, p2]);

      if ( !response || !response.body.match(/id="centerCol"/g) ) {
        // Retry
        continue;
      }

      const { body, statusCode, statusMessage } = response;

      if ( statusCode <= 399 ) {
        return body;
      }

      throw new Error(`${statusCode}: ${statusMessage}`);
    }
    catch (err) {
      console.error(err);
      continue;
    }
  }
}

module.exports = proxiedRequest;
