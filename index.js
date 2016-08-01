
var config = require('./config');
console.log(config);

if (config.ws.enable) {
  var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: config.ws.port });

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      client.send(data);
    });
  };
}

if (config.web.enable) {
  var connect = require('connect');
  var serveStatic = require('serve-static');

  var serve = serveStatic('public', {'index': ['index.html', 'index.htm']})

  connect().use(serve).listen(config.web.port, function(){
      console.log('Server running on ' + config.web.port);
  });
}


function random(low, high) {
  return Math.random() * (high - low) + low;
}

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function log(message) {
  if (config.ws.enable) {
    wss.broadcast(data);
  }
}

function send(data) {
  if (config.ws.enable) {
    wss.broadcast(data);
  }
}

function processData(data) {
  send(data);
}

var nmea = require('nmea');

function genNmeaLines() {
  var talker = 'II';

  var dpt = nmea.encode(talker, {
      type: 'depth-transducer',
      depthMeters: random(3, 20)
    });

  var wind = nmea.encode(talker, {
      type: 'wind',
      angle: randomInt(100, 150),
      reference: 'R',
      speed: randomInt(5, 15),
      units: 'N'
    });

    return dpt + "\n" + wind + "\n";

}

function sendGenNmea() {
  var data = genNmeaLines();

}

if (config.nmea.fake) {
  var nmeaDumpInterval = setInterval(sendGenNmea, 1000);
}

function startTCPData() {
  var net = require('net');

  var client = new net.Socket();
  client.connect(config.tcpClient.port, config.tcpClient.host, function() {
  	log('TCP connected');
  });

  client.on('data', function(data) {
    processData(data.toString());
  });

  client.on('close', function() {
  	log('TCP closed');
  });
}
