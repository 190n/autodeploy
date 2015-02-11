autodeploy
==========
![npm module](https://nodei.co/npm/autodeploy.png?downloads=true)

Simple wrapper to make it easy to automatically deploy newer versions of your web apps

## Installation
```bash
npm install --save autodeploy
```

## What it Is
Autodeploy is a wrapper around node's core `http` module to make it easy to
roll your own (for example) Git-based deployment.

Since many code-hosting sites offer hooks that they will make an HTTP request to
when your code is changed, Autodeploy lets you set up a server on a different
port that your code-hosting site can make requests to.

While automated deployment is great, there are some concerns that need to be
addressed. For instance, there may be some times of day where you know that your
app will be under high load. You wouldn't want to restart your server during
those hours. Autodeploy provides a callback so you can decide if you want to
restart your app. If the callback returns `false`, it will keep calling your
callback at specified intervals, to make sure that the new code is eventually
deployed.

## Usage
`require('autodeploy')` returns a function that you call with options. That
function then returns an instance of `http.Server`, which you can call `listen`
on to start the server. While Autodeploy won't fall apart if you start multiple
servers (as long as they are on different ports), this is not recommended.

Example:
```js
// import autodeploy
var autodeploy = require('autodeploy');

// create the server
var server = autodeploy({
    // called to see if it's a good time to restart the server
    shouldRestart: function() {
        console.log('shouldRestart called');
        return Math.random() > 0.5;
    },

    // called when the app needs to restart
    restart: function() {
        console.log('restart called');
        // fetch new code
        // stop the app
        // install dependencies
        // start the app again
    },

    // specifies how often it should call shouldRestart if it returns false the first time
    interval: 5000,

    // path to listen on
    path: '/restart'
});

// start it!
server.listen(8000);
console.log('autodeploy listening at localhost:8000/restart');
```

## Options
Options are passed in as an object, the only argument to Autodeploy's exported
function.

### shouldRestart
`shouldRestart` is called by Autodeploy the first time the request is made. It
should return `true` if it's a good time to restart the app, `false` otherwise.

If it returns `false` the first time, Autodeploy will keep calling it at the
interval specified.

Default: `function() { return true; }`

### restart
`restart` is the function that Autodeploy calls to restart your app.

This option is required. Autodeploy will throw an error if it is not specified.

### interval
The delay between subsequent calls to `shouldRestart`. This should be either a
number of milliseconds or a string understandable by the
[ms](http://npmjs.com/package/ms) module.

Default: `10000`

### path
The path that will restart your app.

Default: `'/'`

### authorize
A function to authorize the request. This is meant to support systems like
GitHub's Webhooks, where your app is given a secret that you specify as
authorization. The function is passed the request object from node's `http`
module as the only argument.

Default: `function() { return true; }`

## License
Autodeploy is dual-licensed under the
[MIT](http://www.opensource.org/licenses/mit-license.php) and
[GPL 3.0](http://www.opensource.org/licenses/gpl-3.0.html) licenses. This means
that you can use it in **any** package, no matter what license you are using.
