chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  
  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
  }, function(selection) {
    console.log(selection[0]);
    
    // Create URL from selection
    const url = 'https://www.ebay.com/sch/i.html?_nkw=' + encodeURIComponent(selection[0]) + '&LH_Sold=1&_ipg=20&LH_Complete=1'
    
    console.log(url);
    
    // Not using jquery for get
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        // Define array for sold values
        const prices = [];

        // Add each price to the array
        // Using jquery here for some reason tho
        $('.bidsold', this.responseText).each(function(i, price) {
          prices.push($(this).text().trim());
        })

        filteredPrices = filterOutliers(extractPrice(prices));
        console.log(filteredPrices);
        console.log('Average:', sum(filteredPrices)/filteredPrices.length);
        console.log('Low:', min(filteredPrices));
        console.log('High:', max(filteredPrices));
      }
    }

    xhr.send();
    
  });
  
});

// Returns median of a set of numbers
// Sorts the array in-place as well 
function median(array) {
  return array.sort()[Math.floor(array.length / 2)]
}

// Maps an array of price strings to an array of floats
function extractPrice(array) {
  const exp = /[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/
  
  return array.map((price) => {
    return price.match(exp) ? Number(price.match(exp)[0]) : null;
  });
}

// Removes data that is +/- n% of the median
function filterOutliers(array) {
  const n = 0.5;
  const med = median(array);
  
  return array.filter((price) => {
    return price && (price < (med * 1/n) && price > (med * n));
  })
}

function sum(array) {
  return array.reduce((acc, el) => {
    return acc + el;
  })
}

function max(array) {
  return Math.max.apply(Math, array);
}

function min(array) {
  return Math.min.apply(Math, array);
}

