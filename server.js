var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var httpProxy = require('http-proxy');

const proxyMiddleware = function(req, res, next){
  if(
    req.url.indexOf('/getbasicjson/') !== -1
  ){
    console.log('catch proxy');
    console.log(req.url);
    proxy.web(req, res);
  }
  else{
    next();
  }
};

var proxy = httpProxy.createProxyServer({
  target: 'http://stats.onosproject.org:80',
  changeOrigin: true
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  console.log(res.headers);
});

proxy.on('error', function(error, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  console.error('[Proxy]', error);
});

var server = new WebpackDevServer(webpack(config), {
  // publicPath: config.output.publicPath,
  hot: true,
  noContentBase: true,
  // historyApiFallback: true
})


server.app.use(proxyMiddleware);

server.listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});
