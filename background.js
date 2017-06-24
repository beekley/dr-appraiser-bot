chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  
  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
  }, function(selection) {
    console.log(selection[0]);
    
    // Create URL from selection
    const url = 'http://www.ebay.com/sch/i.html?_nkw=' + encodeURIComponent(selection[0]) + '&LH_Sold=1&_ipg=50&LH_Complete=1'
    
    console.log(url);
    
    // Not using jquery for get
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        // Define array for sold values
        const prices = [];

        // Add each price to the array
        $('.bidsold', this.responseText).each(function(i, price) {
          prices.push($(this).text().trim());
        })

        console.log(prices);
      }
    }

    xhr.send();
    
    
    
  });
  
  
});