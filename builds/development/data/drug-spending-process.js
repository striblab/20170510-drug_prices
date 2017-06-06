/**
 * Parse and process drug spending data
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const csv = require('d3-dsv').dsvFormat(',');
const _ = require('lodash');


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

  // Cost per unit per year
  parsed.perUser2011 = parseFloat(row['Total Annual Spending Per User, 2011']);
  parsed.perUser2012 = parseFloat(row['Total Annual Spending Per User, 2012']);
  parsed.perUser2013 = parseFloat(row['Total Annual Spending Per User, 2013']);
  parsed.perUser2014 = parseFloat(row['Total Annual Spending Per User, 2014']);
  parsed.perUser2015 = parseFloat(row['Total Annual Spending Per User, 2015']);

  // Mark as full set
  if (parsed['2011'] && parsed['2012'] && parsed['2013'] && parsed['2014'] && parsed['2015']) {
    parsed.full = true;
  }

  return parsed;
});

// Output
fs.writeFileSync(outputPath, JSON.stringify(processed));



// Break down a name
function breakName(name) {
  return _.filter(name.replace(/\W+/i, ' ').split(' '));
}

// Make ID from name
function makeID(name, subname) {
  let id = name.trim().toLowerCase().replace(/\W+/i, '-');

  if (~ids.indexOf(id)) {
    id = id + '-' + subname.trim().toLowerCase().replace(/\W+/i, '-');
  }

  ids.push[id];
  return id;
}
