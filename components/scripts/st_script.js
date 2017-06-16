/**
 * Main application code for visual piece.
 */

// Main execution and event handling
$(document).ready(function() {
  var allData;
  var currentID;
  var initialDrug = 'epipen-2-pak';

  // Extra information about notable drugs
  var extra = {
    'epipen-2-pak': 'The EpiPen 2 Pak, a common EpiPen product, an epinephine auto-injector used to treat allergy reactions, has seen its price steadily rise since 2011.',
    'thiola': 'Thiola, an orphan drug, was bought in 2013 by Retrophin, founded by Martin Shkreli, who drastically raised the price.',
    'daraprim': 'Daraprim, used to fight parasitic infections, acquired in 2014 by Turing Pharmaceuticals, founded by Martin Shkreli, raised the price remarkably.',
    'chenodal': 'Chenodal is used to treat cerebrotendinous xanthomatosis (CTX), a rare genetic disorder, and saw its price spike in 2014 by Retrophin where Martin Shkreli was the CEO at the time.',
    'crestor': 'Crestor, used to treat high cholesterol and triglyceride levels, has seen a steady increase from 2011 to 2015.',
    'humira-humira-pen': 'Humira is used to treat arthritis, Crohn\'s disease, and other illnesses',
    'ambien': 'Ambien is used to help patients sleep.',
    'lyrica': 'Lyrica, used to treat nerve and muscle pain including fibromyalgia, has seens its price double from 2011 to 2015.',
    'lantus-lantus-solostar': 'Lantus is a popularly presecribed medicine to treat diabetes.'
  };

  // Try to get the jquery ui widget to behave better
  // https://stackoverflow.com/questions/5643767/jquery-ui-autocomplete-width-not-set-correctly
  jQuery.ui.autocomplete.prototype._resizeMenu = function () {
    var ul = this.menu.element;
    ul.outerWidth(this.element.outerWidth());
  }

  // Get drug data
  d3.json('./data/drug-spending.json', function(error, rows) {
    if (error) {
      console.error(error);
      return;
    }

    // Do any calculations
    allData = rows;
    allData.map(function(d) {
      d.extraInfo = extra[d.id] ? extra[d.id] : undefined;
      return d;
    });

    // Populate search
    populateSearch();

    // Draw default chart
    showDrug(initialDrug);

    // Handle drug switching buttons
    $('.drug-switch').on('click', function() {
      var id = $(this).data('id');
      if (id) {
        $('#drug-search-input').val('');
        showDrug(id);
      }
    });
  });

  // Populate search
  function populateSearch() {
    var $input = $('#drug-search-input');

    $input.autocomplete({
    minLength: 3,
     source: allData.map(function(d) {
       return {
         value: d.id,
         label: d.brand + ' / ' + d.generic
       }
     }),
     select: function(e, ui) {
       e.preventDefault();
       $input.val(ui.item.label);
       if (ui.item.value) {
         showDrug(ui.item.value);
       }
     }
   });
  }

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
    if (!data) {
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
    $container.find('.per-user-full').toggle(!!data.perUserFull);
    $container.find('.not-per-user-full').toggle(!data.perUserFull);

    $container.find('.extra-info').html(data.extraInfo)
      .toggle(!!data.extraInfo);

    // Drug switch
    $('.drug-switch').removeClass('active');
    $('[data-id="' + id + '"]').addClass('active');

    // Draw chart
    var chart = c3.generate({
      bindto: '#chart',
      padding: {
        top: 20,
        right: 60,
        bottom: 20,
        left: 90,
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
          },
          label: {
            text: 'Average cost per person',
            position: 'outer-middle'
          }
        },
        x: {
          padding: {
            left: 0.25,
            right: 0.25
          }
        }
      },
      tooltip: {
        contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
          return '<div class="chart-tooltip">' +
            '<span class="tooltip-label">' + d[0].x + ':</span>' +
            '<span class="tooltip-value">' + defaultValueFormat(d[0].value) + '</span>' +
            '</div>';
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
// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
function formatCurrency(number, places, d, t) {
  places = isNaN(places = Math.abs(places)) ? 2 : places;
  d = d == undefined ? '.' : d;
  t = t == undefined ? ',' : t;

  var s = number < 0 ? '-$' : '$';
  var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(places)));
  var j = (j = i.length) > 3 ? j % 3 : 0;

  return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1'+ t) + (places ? d + Math.abs(number - i).toFixed(places).slice(2) : "");
}

// Format change
function formatChange(change, places) {
  places = places || 2;
  return '<span class="' +
    (change > 0 ? 'positive' : change === 0 ? '' : 'negative') + '">' +
    (change > 0 ? '+' : change === 0 ? '' : '') +
    (Math.round(change * Math.pow(10, places)) / Math.pow(10, places)) + '%' +
    '</span>';
}
