(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Main application code for visual piece.
 */

// Main execution and event handling
$(document).ready(function() {
  var allData;
  var currentID;

  // Get drug data
  d3.json('./data/drug-spending.json', function(error, rows) {
    if (error) {
      console.error(error);
      return;
    }

    // Do any calculations
    allData = rows;

    // Draw default chart
    showDrug('epipen-2-pak');

    // Handle drug switching buttons
    $('.drug-switch').on('click', function() {
      var id = $(this).data('id');
      if (id) {
        showDrug(id);
      }
    });
  });

  // Show drug
  function showDrug(id) {
    var $container = $('.drug-details');

    // Check if change
    if (id === currentID) {
      return;
    }
    currentID = id;

    // Find data
    var data = allData.find(function(r) {
      return r.id === id;
    });
    if (!id) {
      console.error('Unable to find data for id: ' + id);
      return;
    }

    // Years
    var years = ['2011', '2012', '2013', '2014', '2015'];

    // Specific values
    var perUser2015 = data.perUser.find(function(d) {
      return d.year === 2015;
    });
    var perUser2011 = data.perUser.find(function(d) {
      return d.year === 2011;
    });

    // Update wording
    $container.find('.brand-name').html(data.brand);
    $container.find('.generic-name').html(data.generic);
    $container.find('.per-user-2015').html(formatCurrency(perUser2015.amount));
    $container.find('.per-user-change').html(formatChange(
      (perUser2015.amount - perUser2011.amount) / perUser2011.amount * 100, 1));
    $container.find('.has-different-names').toggle(!data.same);

    // Drug switch
    $('.drug-switch').removeClass('active');
    $('[data-id=' + id + ']').addClass('active');

    // Draw chart
    var chart = c3.generate({
      bindto: '#chart',
      padding: {
        top: 20,
        right: 60,
        bottom: 20,
        left: 60,
      },
      data: {
        x: 'x',
        columns: [
          ['x'].concat(years),
          ['Amount per user'].concat(data.perUser.map(function(d) {
            return d.amount;
          }))
        ],
        type: 'line'
      },
      legend: {
        show: false
      },
      color: {
        pattern: ['#333333']
      },
      axis: {
        y: {
          min: 0,
          padding: {
            bottom: 0
          },
          tick: {
            count: 4,
            format: d3.format('$,.0f')
          }
        },
        x: {
          padding: {
            left: 0.25,
            right: 0.25
          }
        }
      }
    });
  }
});


// Get the paramter from the function name
function urlParam(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

  if (results != null) {
    return results[1] || 0;
  }
  else {
    return null;
  }
}

// Format money
function formatCurrency(number, places) {
  places = places || 2;
  return '$' + Math.floor(number * Math.pow(10, places)) / Math.pow(10, places);
}

// Format change
function formatChange(change, places) {
  places = places || 2;
  return '<span class="' +
    (change > 0 ? 'positive' : change === 0 ? '' : 'negative') + '">' +
    (change > 0 ? '+' : change === 0 ? '' : '-') +
    (Math.round(change * Math.pow(10, places)) / Math.pow(10, places)) + '%' +
    '</span>';
}

},{}]},{},[1])