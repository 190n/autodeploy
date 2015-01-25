var http = require('http'),
    url = require('url'),
    ms = require('ms');

module.exports = function(options) {
    options = options || {};
    var checkAgainInterval,
        shouldRestart = options.shouldRestart || function() {
            return true;
        },
        restart = options.restart,
        interval = options.interval || 10000,
        path = options.path || '/',
        checkAgainInterval;
    if(!restart) throw new Error('No restart function was passed to autodeploy!');
    if(typeof interval == 'string') interval = ms(interval);
    return http.createServer(function(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('');
        if(checkAgainInterval) return;
        if(url.parse(req.url).pathname != path) return;
        if(shouldRestart()) restart();
        else checkAgainInterval = setInterval(function() {
            if(shouldRestart()) {
                clearInterval(checkAgainInterval);
                checkAgainInterval = undefined;
                restart();
            }
        }, interval);
    });
};