google.load("visualization", "1", {packages:["corechart"]});

function drawChart(city, openings) {
  let data = google.visualization.arrayToDataTable([['Team', 'Openings'], ...openings]);
  let chart = new google.visualization.PieChart(document.getElementById(city));
  chart.draw(data, {title: city, is3D: true});
}

function drawChart0() {
    let total = 10900;
    let given = 3365 + 750 + 661 + 524 + 393 + 344 + 246 + 226 + 217 + 201;
    let data = google.visualization.arrayToDataTable([
        ['City', 'Number of Openings'],
        ['Seattle', 3365],
        ['New York', 750],
        ['Arlington', 661],
        ['Austin', 524],
        ['Bellevue', 393],
        ['Sunnyvale', 344],
        ['Boston', 246],
        ['San Francisco', 226],
        ['East Palo Alto', 217],
        ['Dallas', 201],
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
