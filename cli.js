#!/usr/bin/env node
var rdeps = require('./');
var table = require('text-table');
var stations = require('./data/stations.json');
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
} else if (argv._[0] === 'list') {
  argv._.shift();
}

var stations = argv._.map(function(station) {
  station = station.toLowerCase()
  return (station in stations) ? stations[station].id : station;
});

rdeps(stations, function(err, departures) {
  if (err) {
    if (showData)
      console.log(JSON.stringify({ error: err }));
    else
      console.log('An error occurred: ' + err);

    process.exit(1);
  }

  if (showData)
    return console.log(JSON.stringify(departures, 2));
  else if (!departures.length)
    return console.log(
      'Found no departures at station(s): ' + argv._.join(', ')
    );

  var data = [['station', 'departure', 'direction', 'line']];

  departures.forEach(function(dep) {
    dep.stop = dep.stop.replace(/\sst\s\(\w+\)/, '');
    data.push([
      dep.stop, dep.time, dep.direction, dep.name.split(' ').pop()
    ]);
  });

  console.log(table(data));
});
