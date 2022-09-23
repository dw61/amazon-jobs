import fetch from "node-fetch";

let response = await fetch('https://raw.githubusercontent.com/dw61/amazon-jobs/main/data.json');
let responseText = await response.text();

console.log(responseText);
// document.getElementById("demo").innerHTML = responseText;
