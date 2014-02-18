# rejseplan-departures

Utilising the API provided by Rejseplanen
[available here](http://labs.rejseplanen.dk/)

## usage

    usage: rjs-deps <command> [stations]

      shows the departure table for each station

      <command> can be any of the following and defaults to 'list':
      data    export the data in json format
      list    show a fancy listview of the departures


## methods
```js
var departures = require('rejseplan-departures');
```
### departures(stations, options = {}, cb)
Calls the callback `cb` with signature `function(err, departureList)` when it
has fetched a list of departures from the given `stations`.

Each station in `stations` is the ID number used be the Rejseplanen API. Take
a look in the [data/](data/) directory.

You can pass some `options`:

  - `options.exclude` - An array of transport types to exclude. Possible values
  `['train', 'bus', 'metro']`

  - `options.date` - The date for which the departure-table should be fetched.
  Can be given in any format that [moment](http://momentjs.com) understands

#### example
```js
var departures = require('rejseplan-departures');
departures(['8603307'], { exclude: ['train', 'bus'] }, function(err, deps) {
  // deps should now be an array of metro departures from Nørreport st (Metro).
});
```

