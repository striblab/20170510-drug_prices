$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results != null) { return results[1] || 0; }
  else { return null; }
}

var selected = $.urlParam('chart');

if (selected != null){
$(".slide").hide();
$("#" + selected).show();
}

d3.csv("./data/drugs.csv", function(d) {
  return {
    brand: d.brand,
    year: +d.year,
    generic: d.generic,
    original: d.original,
    amount: +d.amount
  };
}, function(error, rows) {

var data = rows;

var axis = [];
var dataStream = [];
axis[0] = 'x';
var indexYear = 1;

for (var j=2011; j<2016; j++){
  axis[indexYear] = j;
  dataStream[indexYear] = 0;
  indexYear++;
}

function switchChart(name,colors){

  var found = false;
  dataStream[0] = "Price";
  var index = 0;

  for (var i=0; i < data.length; i++){
    if (name == data[i].brand || name == data[i].generic){
       console.log(name + " " + data[i].brand);
      found = true;
      index = i;
      for (var k=1; k < dataStream.length; k++){
        if (name != data[i].brand && name != data[i].generic){ break; }
        if (axis[k] == data[index].year) { 
          dataStream[k] = data[index].amount; 
          $("#rate").html(data[index].amount);
          $("#year").html(data[index].year);
          index++; 
        }
      }
      // break;
    }
  }

if (found == true){

var  padding = {
        top: 20,
        right: 60,
        bottom: 20,
        left: 60,
    };

$(".pctchange").removeClass("neg");
$(".pctchange").removeClass("pos");

var changes = (dataStream[5] - dataStream[1])/dataStream[1];
$("#price").html(d3.format("$,.0f")(dataStream[5]));
$(".pctchange").html(d3.format("+%")(changes));
if (changes < 0) { $(".pctchange").addClass("neg"); }
else if (changes > 0) { $(".pctchange").addClass("pos"); }
else { $(".pctchange").removeClass("neg"); $(".pctchange").removeClass("pos"); }

var share = "#B0BEC5";

var chart = c3.generate({
        bindto: '#chart',
        padding: padding,
    data: {
        x: 'x',
        columns: [
            axis,
            dataStream
        ],
        type: 'line'
    },
    legend: { show:false },
    color:  {  pattern: [colors] },
    axis: {
      y: {
            min: 0,
            padding: {bottom: 0},
            tick: {
             count: 4,
             format: d3.format('$,.0f')
            }
        },
        x: {
            tick: {
                values: ['2011', '2012', '2013', '2014', '2015'],
                count: 5,
                multiline: false
            }
          }
        },
      tooltip: {
      contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
          var $$ = this, config = $$.config,
              titleFormat = config.tooltip_format_title || defaultTitleFormat,
              nameFormat = config.tooltip_format_name || function (name) { return name; },
              valueFormat = config.tooltip_format_value || defaultValueFormat,
              text, i, title, value, name, bgcolor;
          for (i = 0; i < d.length; i++) {
              if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

              if (! text) {
                  title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                  text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
              }

              var priceNum = 0;

              name = nameFormat(d[i].name);
              value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
              bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

              for (var k=0; k < rows.length; k++){
                if (rows[k].brand == name && rows[k].year == Number(title)){
                  priceNum = rows[k].amount;
                  break;
                }
              }

              text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
              text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>Price</td>";
              text += "<td class='value'>" + value + "</td>";
              text += "</tr>";
              // text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>Total Births</td>";
              // text += "<td class='value'>" + priceNum + "</td>";
              // text += "</tr>";
              
          }
          return text + "</table>";
      }
    }
});
}
else { $("#current").html("Name not found"); }

}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results != null) { return results[1]; }
  else { return 0; }
}

if ($.urlParam('name') != 0 ) { 
  var name = $.urlParam('name').toUpperCase();
  var colorMe = "#333333"
  $(".named").html(decodeURI(name));
  switchChart(decodeURI(name),colorMe);
  if (decodeURI(name) != "EPIPEN 2-PAK") { $(".chartSwitcher").removeClass("selected"); }
} 

  $( document ).ready(function() {
    $(".chartSwitcher").click(function()  {
      $(".chartSwitcher").removeClass("selected");
      $(this).addClass("selected");
      var name = $(this).text();
      var colorMe = "#333333"
      $(".named").html(name.toUpperCase());
      switchChart(decodeURI(name.toUpperCase()),colorMe);
    });

   $('#filter_box').keyup(function(e){
        if(e.keyCode == 13)
        {
          window.location.href = './?name=' + $('#filter_box').val();
        }
    });
    
});   

});