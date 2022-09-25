google.load("visualization", "1", {packages:["corechart"]});

fetch('https://raw.githubusercontent.com/dw61/amazon-jobs/main/openings.json')
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

  // google.setOnLoadCallback(drawChart0);
  // google.setOnLoadCallback(() => drawChart(city, openings[city]));
  google.setOnLoadCallback(drawChart2);
  // google.setOnLoadCallback(drawChart3);
  // google.setOnLoadCallback(drawChart4);
  // google.setOnLoadCallback(drawChart5);
  // google.setOnLoadCallback(drawChart6);
  // google.setOnLoadCallback(drawChart7);
  // google.setOnLoadCallback(drawChart8);
  // google.setOnLoadCallback(drawChart9);
  // google.setOnLoadCallback(drawChart10);
  // document.getElementById("demo").innerHTML = [['Team', 'Headcounts'], ...openings["Seattle"]];
  // console.log([['Team', 'Head Counts'], ...openings["Seattle"]]);
});

function drawChart(city, openings) {
  let data = google.visualization.arrayToDataTable([['Team', 'Openings'], ...openings]);
  let chart = new google.visualization.PieChart(document.getElementById(city));
  chart.draw(data, {title: city, is3D: true});
}

function drawChart2() {
    let data = google.visualization.arrayToDataTable([
        ['Team', 'Number of Openings'],
        ['AWS', 588],
        ['Amazon Alexa', 95],
        ['Advertising', 87],
        ['Finance and Global Business Services', 63],
        ['Operations Technology', 60],
        ['Customer Trust and Partner Support', 54],
        ['Amazon Devices', 52],
        ['Amazonian Experience and Technology', 48],
        ['HR', 48],
        ['Consumer Payments', 20],
        ['Amazon Entertainment', 18],
        ['Retail', 18],
        ['Amazon Go', 14],
        ['Kindle Content', 13],
        ['Amazon Books', 9],
        ['Amazon Diagnostics', 7],
        ['Legal', 7],
        ['Subsidiaries', 5],
        ['Customer Service and Business Trends', 4],
        ['eCommerce Foundation', 4],
        ['Marketplace', 2],
        ['Amazon Transportation Services', 2],
        ['Business and Corporate Development', 1]
      ]);

  let options = {
    title: 'Arlington',
    is3D: 'false'
 };

  let chart = new google.visualization.PieChart(document.getElementById('chart2'));
  chart.draw(data, options);
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

let chart = new google.visualization.PieChart(document.getElementById('chart0'));
  chart.draw(data, options);
}


function drawChart3() {
    let data = google.visualization.arrayToDataTable([
        ['Team', 'Number of Openings'],
        ['AWS', 176],
        ['Operations Technology', 122],
        ['Retail', 113],
        ['Amazon Devices', 90],
        ['eCommerce Foundation', 75],
        ['Amazon Fresh', 64],
        ['Advertising', 44],
        ['HR', 35],
        ['Fulfillment and Operations', 25],
        ['Consumer Payments', 19],
        ['Amazon Entertainment', 16],
        ['Amazon Transportation Services', 16],
        ['Consumer Engagement', 13],
        ['Subsidiaries', 13],
        ['Marketplace', 8],
        ['Amazon Alexa', 5],
        ['Business and Corporate Development', 4],
        ['Kindle Content', 4],
        ['Amazonian Experience and Technology', 3],
        ['Amazon Care', 2],
        ['Amazon Go', 2],
        ['Finance and Global Business Services', 2]
      ]);

  let options = {
    title: 'Austin',
    is3D: 'true'
 };

  let chart = new google.visualization.PieChart(document.getElementById('chart3'));
  chart.draw(data, options);
}

function drawChart4() {
    let data = google.visualization.arrayToDataTable([
        ['Team', 'Number of Openings'],
        ['AWS', 296],
        ['Advertising', 291],
        ['eCommerce Foundation', 73],
        ['Consumer Engagement', 49],
        ['Operations Technology', 48],
        ['Retail', 27],
        ['Amazon Entertainment', 18],
        ['Subsidiaries', 11],
        ['HR', 7],
        ['Amazon Care', 6],
        ['Amazon Care', 5],
        ['Selling Partner Services', 5],
        ['Amazon Devices', 2],
        ['Business and Corporate Development', 2],
        ['Customer Experience and Business Trends', 2],
        ['Fulfillment and Operations', 2],
        ['Kindle Content', 2],
        ['Marketplace', 2],
        ['Amazon Alexa', 1],
        ['Amazon Customer Service', 1],
        ['Amazonian Experience and Technology', 1],
        ['Consumer Payments', 1],
        ['Prime Video', 1]
      ]);

  let options = {
    title: 'New York',
    is3D: 'true'
 };

  let chart = new google.visualization.PieChart(document.getElementById('chart4'));
  chart.draw(data, options);
}

function drawChart5() {
    let data = google.visualization.arrayToDataTable([
        ['Team', 'Number of Openings'],
        ['Amazon Devices', 216],
        ['Amazon Alexa', 211],
        ['eCommerce Foundation', 152],
        ['AWS', 79],
        ['Advertising', 11],
        ['Retail', 9],
        ['Operations Technology', 8],
        ['Finance and Global Business Services', 6],
        ['Kindle Content', 6],
        ['Consumer Engagement', 4],
        ['Digital Entertainment', 2],
        ['HR', 2],
        ['Amazon Go', 1],
        ['Amazonian Experience and Technology', 1],
        ['Consumer Payments', 1],
        ['Amazon Entertainment', 1]
      ]);

  let options = {
    title: 'Sunnyvale',
    is3D: 'true'
 };

  let chart = new google.visualization.PieChart(document.getElementById('chart5'));
  chart.draw(data, options);
}

function drawChart6() {
    let data = google.visualization.arrayToDataTable([
        ['Team', 'Number of Openings'],
        ['Operations Technology', 223],
        ['AWS', 207],

        ['Amazon Alexa', 73],
        ['Amazon Transportation Services', 42],
        ['Amazon Devices', 35],
        ['Customer Trust and Partner Support', 12],
        ['Marketplace', 11],
        ['HR', 10],
        ['Fulfillment and Operations', 6],
        ['Retail', 4],
        ['Finance and Global Business Services', 3],
        ['Advertising', 1],
        ['Consumer Engagement', 1]
      ]);

  let options = {
    title: 'Bellevue',
    is3D: 'true'
 };

  let chart = new google.visualization.PieChart(document.getElementById('chart6'));
  chart.draw(data, options);
}

function drawChart7() {
    let data = google.visualization.arrayToDataTable([
        ['Team', 'Number of Openings'],

        ['AWS', 324],
        ['Amazon Alexa', 19],
        ['HR', 8],
        ['Amazon Transportation Services', 8],
        ['Amazonian Experience and Technology', 7],
        ['Retail', 6],
        ['Operations Technology', 3],
        ['Amazon Devices', 2]
      ]);

  let options = {
    title: 'Boston',
    is3D: 'true'
 };

  let chart = new google.visualization.PieChart(document.getElementById('chart7'));
  chart.draw(data, options);
}

function drawChart8() {
    let data = google.visualization.arrayToDataTable([
        ['Team', 'Number of Openings'],
        ['Amazon Alexa', 102],
        ['Amazon Devices', 76],
        ['Consumer Engagement', 36],
        ['Amazon Entertainment', 36],
        ['Retail', 19],
        ['AWS', 14],
        ['Operations Technology', 7],
        ['Amazon Fresh', 5],
        ['Amazon Go', 4],
        ['Fulfillment and Operations', 4],
        ['Subsidiaries', 3],
        ['Digital Entertainment', 2],
        ['HR', 2]
      ]);

  let options = {
    title: 'Irvine',
    is3D: 'true'
 };

  let chart = new google.visualization.PieChart(document.getElementById('chart8'));
  chart.draw(data, options);
}

function drawChart9() {
    let data = google.visualization.arrayToDataTable([
        ['Team', 'Number of Openings'],
        ['Subsidiaries', 73],
        ['Amazon Entertainment', 70],
        ['AWS', 30],
        ['Amazon Devices', 27],
        ['Consumer Engagement', 20],
        ['Operations Technology', 17],
        ['Digital Entertainment', 13],
        ['Retail', 12],
        ['Amazon Go', 9],
        ['HR', 3],
        ["Advertising", 1],
        ['Amazon Care', 1],
        ['Amazon Fresh', 1],
        ['Business and Corporate Development', 1],
        ['Finance and Global Business Services', 1],
        ['Kindle Content', 1]
      ]);

  let options = {
    title: 'San Francisco',
    is3D: 'true'
 };

  let chart = new google.visualization.PieChart(document.getElementById('chart9'));
  chart.draw(data, options);
}

function drawChart10() {
    let data = google.visualization.arrayToDataTable([
        ['Team', 'Number of Openings'],
        ['AWS', 265],
        ['Operations Technology', 5],
        ['HR', 4],
        ['Amazon Care', 1],
        ['Customer Experience and Business Trends', 1],
        ['Amazon Entertainment', 1],
        ['Marketplace', 1]
      ]);

  let options = {
    title: 'East Palo Alto',
    is3D: 'true'
 };

  let chart = new google.visualization.PieChart(document.getElementById('chart10'));
  chart.draw(data, options);
}

$(window).resize(function(){
  drawChart0();
  drawChart();
  drawChart2();
  drawChart3();
  drawChart4();
  drawChart5();
  drawChart6();
  drawChart7();
  drawChart8();
  drawChart9();
  drawChart10();
});

// Reminder: you need to put https://www.google.com/jsapi in the head of your document or as an external resource on codepen //
