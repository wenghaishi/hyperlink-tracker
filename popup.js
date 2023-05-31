// Receive the hyperlinks from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.hyperlinks) {
    // Update the popup HTML with the received hyperlinks
    updatePopupHyperlinks(message.hyperlinks);
  }
});

// Function to update the popup HTML with hyperlinks
function updatePopupHyperlinks(hyperlinks) {
  const hyperlinksTableBody = document.getElementById("hyperlinks-table-body");
  hyperlinks = hyperlinks.filter((element) => element.trim() !== "");

  // Count the occurrences of each hyperlink
  const occurrenceMap = hyperlinks.reduce((map, hyperlink) => {
    map.set(hyperlink, (map.get(hyperlink) || 0) + 1);
    return map;
  }, new Map());

  // Function to log the hyperlink
  function logHyperlink(url) {
    fetch("http://localhost:5000/log_hyperlink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message); // Log the response message
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Example usage: call logHyperlink() when a hyperlink is encountered
  logHyperlink(hyperlinks);

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentURL = tabs[0].url;
    const hasCurrentURL = new Map();

    occurrenceMap.forEach((occurrences, hyperlink) => {
      const row = document.createElement("tr");
      const currentUrlCell = document.createElement("td");
      const hyperlinkCell = document.createElement("td");
      const occurrencesCell = document.createElement("td");

      if (!hasCurrentURL.get(hyperlink)) {
        currentUrlCell.textContent = currentURL;
        row.appendChild(currentUrlCell);
        hasCurrentURL.set(hyperlink, true);
      }

      hyperlinkCell.textContent = hyperlink;
      occurrencesCell.textContent = occurrences;

      row.appendChild(hyperlinkCell);
      row.appendChild(occurrencesCell);
      hyperlinksTableBody.appendChild(row);
    });
  });

  // connect to native messaging port
  var port = chrome.runtime.connectNative("com.link-tracker");
  port.onMessage.addListener(function (msg) {
    console.log("Received" + msg);
  });
  port.onDisconnect.addListener(function () {
    console.log("Disconnected");
  });
  port.postMessage({ text: "Hello, my_application" });
}
