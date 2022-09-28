google.load("visualization", "1", {packages:["corechart"]});

function drawChart(city, openings) {
  let data = google.visualization.arrayToDataTable([['Team', 'Openings'], ...openings]);
  let chart = new google.visualization.PieChart(document.getElementById(city));
  chart.draw(data, {title: city, is3D: true});
}

function drawChart0() {
    let total = 15300;
    let given = 6335 + 1232 + 902 + 859 + 722 + 635 + 405 + 314 + 284 + 279;
    let data = google.visualization.arrayToDataTable([
        ['City', 'Number of Openings'],
        ['Seattle', 6335],
        ['Arlington', 1232],
        ['Austin', 902],
        ['New York', 859],
        ['Sunnyvale', 722],
        ['Bellevue', 635],
        ['Boston', 405],
        ['Irvine', 314],
        ['San Francisco', 284],
        ['East Palo Alto', 279],
        ['Other', total - given]
      ]);

  let options = {
    title: '10 Largest Cities',
    is3D: 'true'
 };

// https://www.amazon.jobs/en/search.json?category%5B%5D=software-development&schedule_type_id%5B%5D=Full-Time&normalized_country_code%5B%5D=USA&normalized_city_name%5B%5D=Brisbane&facets%5B%5D=business_category

let chart = new google.visualization.PieChart(document.getElementById('chart0'));
  chart.draw(data, options);
}

fetch('openings.json')
.then(response => response.json())
.then(openings => {

  let cities = Object.keys(openings);
  let htmlElements = "";
  for (let i = 0; i < cities.length; i += 2) {
    htmlElements += `
    <div class="row">
      <div class="clearfix"></div>
      <div class="col-lg-6">
        <div id="${cities[i]}" class="chart"></div>
      </div>
      <div class="col-lg-6">
        <div id="${cities[i+1]}" class="chart"></div>
      </div>
    </div>`;
  }
  document.body.innerHTML += htmlElements;

  google.setOnLoadCallback(drawChart0);
  for (let city in openings) {
    google.setOnLoadCallback(() => drawChart(city, openings[city]));
  }

});

$(window).resize(function(){
  drawChart;
});
