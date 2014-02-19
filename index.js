var http = require('http'),
  qs = require('querystring'),
  moment = require('moment'),
  cheerio = require('cheerio');

function parseDepartures(html, cb) {
  var $ = cheerio.load(html), deps = [];

  var root = $('MultiDepartureBoard');
  if (root.attr('error'))
    return cb(root.attr('error'));

  $('Departure').each(function(i, el) {
    var departure = {};
    Object.keys(el.attribs).forEach(function(field) {
      departure[field] = el.attribs[field];
    });
    deps.push(departure);
  });

  cb(null, deps);
}

module.exports = function departures(stations, options, cb) {
  var query = {};

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (options.date) {
    var date = moment(options.date);
    query.date = date.format('DD.MM.YY');
    query.time = date.format('HH:mm');
  }

  if (options.exclude) {
    options.exclude.forEach(function(transport) {
      if (transport === 'bus') {
        query.useBus = 0;
      } else if (transport === 'train' || transport === 'tog') {
        query.useTog = 0;
      } else if (transport === 'metro') {
        query.useMetro = 0;
      }
    });
  };

  stations.forEach(function(station, i) {
    query['id' + (i + 1)] = station;
  });

  var options = {
    hostname: 'xmlopen.rejseplanen.dk',
    port: 80,
    path: '/bin/rest.exe/multiDepartureBoard?' + qs.stringify(query)
  };

  var req = http.request(options, function(res) {
    var body = '';

    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      parseDepartures(body, cb);
    });
  });

  req.on('error', function(e) {
    cb(e);
  });

  req.end();
};

