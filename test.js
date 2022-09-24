var responseText;

fetch('https://raw.githubusercontent.com/dw61/amazon-jobs/main/data.json')
.then(response => response.text())
.then(responseText => {
      document.getElementById("demo").innerHTML = responseText;
});
