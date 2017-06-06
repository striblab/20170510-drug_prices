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

  // Cost per user for each year
  parsed.perUser = [];
  ['2011', '2012', '2013', '2014', '2015'].forEach((y) => {
    let v = parseFloat(row['Total Annual Spending Per User, ' + y]);
    if (!_.isNaN(v)) {
      parsed.perUser.push({
        year: +y,
        amount: v
      });
    }
  });

  // Mark as full set
  if (parsed.perUser.length === 5) {
    parsed.perUserFull = true;
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
