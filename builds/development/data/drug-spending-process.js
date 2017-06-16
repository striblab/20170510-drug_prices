/**
 * Parse and process drug spending data
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const csv = require('d3-dsv').dsvFormat(',');
const _ = require('lodash');
require('console.table');

// Input
const source = csv.parse(fs.readFileSync(path.join(__dirname, 'drug-spending.csv'), 'utf-8'));

// Output
const outputPath = path.join(__dirname, 'drug-spending.json');
let processed;

// ID check
let ids = [];


// Go through each row
processed = _.map(source, (row) => {
  let parsed = {};

  // Check names
  parsed.brand = row['Brand Name'].trim();
  parsed.generic = row['Generic Name'].trim();

  // Try to mark ones that are the same.  There are some weird things and
  // mispellings, so not perfect
  if (_.isEmpty(_.xor(breakName(parsed.brand), breakName(parsed.generic)))) {
    parsed.same = true;
  }

  // Make id
  parsed.id = makeID(parsed.brand);

  // Cost per user for each year
  parsed.perUser = [];
  parsed.perUserFull = true;
  ['2011', '2012', '2013', '2014', '2015'].forEach((y) => {
    let v = parseFloat(row['Total Annual Spending Per User, ' + y]);
    parsed.perUser.push({
      year: +y,
      amount: !_.isNaN(v) ? v : null
    });

    // Mark as full set
    parsed.perUserFull = _.isNaN(v) ? false : parsed.perUserFull;
  });

  return parsed;
});

// Output
fs.writeFileSync(outputPath, JSON.stringify(_.sortBy(processed, 'brand')));

// Find some high value targets
console.table('Highest prices of any year', _.take(_.map(_.sortBy(processed, (d) => {
  let m = _.maxBy(d.perUser, 'amount');
  return m ? m.amount : -1;
}), (d) => {
  let m = _.maxBy(d.perUser, 'amount');

  return {
    id: d.id,
    'Max amount': m ? m.amount : null,
    'Max year': m ? m.year : null,
    'All years': d.perUserFull
  };
}).reverse(), 20));

console.table('Highest change', _.take(_.map(_.sortBy(processed, (d) => {
  return !d.perUserFull ? -1 : (d.perUser[4].amount - d.perUser[0].amount) / d.perUser[0].amount;
}), (d) => {
  let m = _.maxBy(d.perUser, 'amount');

  return {
    id: d.id,
    '2011': d.perUserFull ? d.perUser[0].amount : null,
    '2015': d.perUserFull ? d.perUser[4].amount : null,
    'Change': d.perUserFull ? ((d.perUser[4].amount - d.perUser[0].amount) / d.perUser[0].amount * 100).toFixed(1) + '%' : null
  };
}).reverse(), 20));

console.table('Lowest change', _.take(_.map(_.sortBy(processed, (d) => {
  return !d.perUserFull ? 0 : (d.perUser[4].amount - d.perUser[0].amount) / d.perUser[0].amount;
}), (d) => {
  let m = _.maxBy(d.perUser, 'amount');

  return {
    id: d.id,
    '2011': d.perUserFull ? d.perUser[0].amount : null,
    '2015': d.perUserFull ? d.perUser[4].amount : null,
    'Change': d.perUserFull ? ((d.perUser[4].amount - d.perUser[0].amount) / d.perUser[0].amount * 100).toFixed(1) + '%' : null
  };
}), 20));


// Break down a name
function breakName(name) {
  return _.filter(name.replace(/\W+/i, ' ').split(' '));
}

// Make ID from name
function makeID(name, subname) {
  let id = name.trim().toLowerCase().replace(/(\W|\s)+/gi, '-');

  if (~ids.indexOf(id)) {
    id = id + '-' + subname.trim().toLowerCase().replace(/\W+/gi, '-');
  }

  ids.push[id];
  return id;
}
