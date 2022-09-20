import fetch from "node-fetch";

fetch('file:///Users/wlt/Documents/amazon-jobs/data.json')
  .then(response => response.text())
  .then(text => console.log(text))
