
var testNmeaInterval = null;

function log(line){
  $('#log').append(line + "\n");
}

function testFunc() {
  alert('hi');
}



function wsTest() {
	if(!("WebSocket" in window)){
		$('<p>Oh no, you need a browser that supports WebSockets.</p>').appendTo('#container');
	} else {
    //The user has WebSockets
    //connect();
  }
}

function wsConnect(){
  var host = document.domain + ':8000';
  var socket;
  var host = 'ws://' + host + '/nmea';

  try {
    var socket = new WebSocket(host);

      socket.onopen = function(){
         log('Socket: '+socket.readyState+' (open)');
      }

      socket.onmessage = function(msg){
         onData(msg.data);
      }

      socket.onclose = function(){
         log('Socket: '+socket.readyState+' (Closed)');
      }

  } catch(exception){
     log('Error: '+exception);
  }
}

function tabs() {
  $('.tabs li').click(function(){
  		var tab_id = $(this).find('a').first().attr('href');

  		$('.tabs li').removeClass('pure-menu-selected');
  		$('.tab-content').removeClass('current');

  		$(this).addClass('pure-menu-selected');
  		$(tab_id).addClass('current');
  	})

}

function updateUIField(type, fields) {
  if (type == 'DBT') {
    var val = round(fields[2], 1);
    $('#data-dpt').text(val);
  }

  if (type == 'MWV') {
    var awa = parseInt(fields[0]);
    var aws = fields[2];
    $('#data-awa').text(awa);
    $('#data-aws').text(aws);


    $('#arc-awa').attr("d", describeArc(200, 200, 100, awa-5, awa+5));
    $('#arc-aws-value').text(aws);
    // $('#arc-awa').attr("d", describeArc(200, 200, 100, 121, 128));

  }
}

function onData(data) {
  data.split("\n").forEach(function(line){
    line = line.replace(/(\r\n|\n|\r)/gm,"");

    if (!line || line.length === 0) {
      return;
    }

    log(line);

    var sentence = NMEA.parse(line);
    if (sentence) {
      updateUIField(sentence['type'], sentence['fields']);
    }


  })
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function random(low, high) {
  var val = Math.random() * (high - low) + low;
  return round(val, 2);
}

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function genTestNMEA() {
  var dbt = "$--DBT,,f," +random(3, 20)+ ",M,,F";
  dbt = dbt + NMEA.computeChecksum(dbt) + "\r\n";

  var mwv = "$--MWV," +randomInt(100, 150)+ ",R," +randomInt(5, 15)+ ",a"
  mwv = mwv + NMEA.computeChecksum(mwv) + "\r\n";
  //nmea = "$WIWVM,{0},R,{1},N,A".format(DIRECTION, SPEED)

  return dbt + mwv;
}

function runTestNMEA() {
  var data = genTestNMEA();
  onData(data);
}

function runTestData(){
  if (testNmeaInterval) {
    clearInterval(testNmeaInterval);
    testNmeaInterval = null;
    $('#test-btn').text('Start Test');
  } else {
    testNmeaInterval = setInterval(runTestNMEA, 250);
    $('#test-btn').text('Stop Test');
  }

}

function onReady() {
  $('#reconnect-btn').click(wsConnect);
  $('#test-btn').click(runTestData);
  $('#test1-btn').click(runTestNMEA);
  tabs();

  var awaChart = $("#chart-awa").peity("donut", { radius: 64 });


}

$(document).ready(onReady);
