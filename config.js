var config = {};

config.ws = {};
config.web = {};
config.nmea = {};
config.tcpClient = {};
config.tcpServer = {};


config.ws.enable = true;
config.ws.port = 8000;

config.web.enable = true;
config.web.port = 8080;

config.tcpClient.enable = false;
config.tcpClient.host = '192.168.2.142';
config.tcpClient.port = '10110';

// TODO: code this
config.tcpServer.enable = false;
config.tcpServer.port = '10110';

config.nmea.fake = true;

module.exports = config;
