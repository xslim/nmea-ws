
(function() {
  var NMEA = (function() {
    var NMEA = function(options) {
      this.options = options;
      this.version = 0.1;
    };

    // verify the checksum
    NMEA.prototype.verifyChecksum = function(sentence, checksum) {
      var q;
      var c1;
      var c2;
      var i;

      // skip the $
      i = 1;

      // init to first character
      c1 = sentence.charCodeAt(i);

      // process rest of characters, zero delimited
      for( i = 2; i < sentence.length; ++i) {
        c1 = c1 ^ sentence.charCodeAt(i);
      }

      // checksum is a 2 digit hex value
      c2 = parseInt(checksum, 16);

      // should be equal
      return ((c1 & 0xff) === c2);
    };

    var m_hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

    NMEA.prototype.toHexString = function(v) {
      var lsn;
      var msn;

      msn = (v >> 4) & 0x0f;
      lsn = (v >> 0) & 0x0f;
      return m_hex[msn] + m_hex[lsn];
    };

    // generate a checksum for  a sentence (no trailing *xx)
    NMEA.prototype.computeChecksum = function(sentence) {
      var c1;
      var i;

      // skip the $
      i = 1;

      // init to first character    var count;

      c1 = sentence.charCodeAt(i);

      // process rest of characters, zero delimited
      for( i = 2; i < sentence.length; ++i) {
        c1 = c1 ^ sentence.charCodeAt(i);
      }

      return '*' + NMEA.prototype.toHexString(c1);
    };

    var validLine = function (line) {
      // check that the line passes checksum validation
      // checksum is the XOR of all characters between $ and * in the message.
      // checksum reference is provided as a hex value after the * in the message.
      var checkVal = 0;
      var parts = line.split('*');
      for (var i = 1; i < parts[0].length; i++) {
        checkVal = checkVal ^ parts[0].charCodeAt(i);
      }
      ;
      return checkVal == parseInt(parts[1], 16);
    };

    // parse
    NMEA.prototype.parse = function (line) {
      if (!validLine(line)) {
        return;
      }

      var fields = line.split('*')[0].split(','),
          talker_id,
          msg_fmt;
      if (fields[0].charAt(1) == 'P') {
        talker_id = 'P'; // Proprietary
        msg_fmt = fields[0].substr(2);
      } else {
        talker_id = fields[0].substr(1, 2);
        msg_fmt = fields[0].substr(3);
      }

      fields = fields.slice(1);

      var val = {};
      val.talker = talker_id;
      val.type = msg_fmt;
      val.fields = fields;

      return val;

    };

    return NMEA;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = new NMEA();
  else
    window.NMEA = new NMEA();
})();
