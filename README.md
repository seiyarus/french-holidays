A simple JavaScript library for working whith french holidays.  
This library read the open-data file of the french governement, concerning this actual year and the next 3 scolar years (eg, in 2015 : all the year of 2015 and scolar year of 2015-2016, 2016-2017 and 2017-2018).


# Installation

`npm install french-holidays`

# Usage
## For a year
By a specific zone
```javascript
var holidays = require('french-holidays');
console.log(holidays.by_year(2015, 'a'))
```

For all zones
```javascript
var holidays = require('french-holidays');
console.log(holidays.by_year(2015))
```

## Check if one day is in holidays
```javascript
var holidays = require('french-holidays');
console.log(holidays.isDateInHolidays('20160213', 'YYYYMMDD', 'A'))
```
should return true

## Check if array of days is in holidays
```javascript
var holidays = require('french-holidays');
console.log(holidays.isDateInHolidays(['20160206', '20160213', '20151017'], 'YYYYMMDD', 'A'))
```

should return [false, true, true]

# Author

Julien Fournier <seiyarus@gmail.com>

# License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
