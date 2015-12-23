var logger     = require('./lib/logger.js');
module.exports = {
    /**
     * Before connection (optional, just for faye)
     * @param {client} client connection
     */
    beforeConnect : function(client) {
        logger.error('call beforeconnect');
        // Example:
        // client.setHeader('Authorization', 'OAuth abcd-1234');
        // client.disable('websocket');
    },

    /**
     * On client connection (required)
     * @param {client} client connection
     * @param {done} callback function(err) {}
     */
    onConnect : function(client, done) {
        logger.error('call onconnect');
        // Faye client
        // client.subscribe('/channel', function(message) { });

        // Socket.io client
        // client.emit('test', { hello: 'world' });

        // Primus client
        // client.write('Sailing the seas of cheese');

        // WAMP session
        // client.subscribe('com.myapp.hello').then(function(args) { });

        client.onmessage = function(msg) {
            var data = JSON.parse(msg.data);
            logger.error('ticks update: ' + data);
        };
        client.send(JSON.stringify({ticks:'R_100'}));

        done();
    },

    /**
     * Send a message (required)
     * @param {client} client connection
     * @param {done} callback function(err) {}
     */
    sendMessage : function(client, done) {
        // Example:
        // client.emit('test', { hello: 'world' });
        // client.publish('/test', { hello: 'world' });
        // client.call('com.myapp.add2', [2, 3]).then(function (res) { });
        logger.error('call sendmessage');
        done();
    },

    /**
     * WAMP connection options
     */
    options : {
        // realm: 'chat'
    }
};
