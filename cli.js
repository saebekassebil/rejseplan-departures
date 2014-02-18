#!/usr/bin/env node
var rdeps = require('./');
var table = require('text-table');
var stations = require('./data/stations.json');
var aliases = require('./data/aliases.json');
var argv = require('minimist')(process.argv.slice(2));

if (!argv._.length) {
  console.log('usage: rjsdep [stations]');
  console.log('');
  console.log('  shows the departure table for each station');
  console.log('');
  console.log('  <command> can be any of the following and defaults to \'list\'');
  console.log('  data\texport the data in json format');
  console.log('  list\tshow a fancy listview of the departures');
  console.log('')
  process.exit(0);
}

var showData = false;
if (argv._[0] === 'data') {
  argv._.shift();
  showData = true;
}

var stations = argv._
  .map(function(station) {
    return (station in aliases) ? aliases[station] : station;
  }).map(function(station) {
    return (station in stations) ? stations[station].id : station;
  });

rdeps(stations, function(err, departures) {
  if (showData)
    return console.log(JSON.stringify(departures, 2));

  var data = [['station', 'departure', 'direction', 'line']];

  departures.forEach(function(dep) {
    data.push([
      dep.stop, dep.time, dep.direction, dep.name.split(' ').pop()
    ]);
  });

  console.log(table(data));
});
