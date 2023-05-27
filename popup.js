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
  // Clear any existing rows
  console.log(hyperlinks);

  // Count the occurrences of each hyperlink
  const occurrenceMap = hyperlinks.reduce((map, hyperlink) => {
    map.set(hyperlink, (map.get(hyperlink) || 0) + 1);
    return map;
  }, new Map());

  // Iterate over the hyperlinks data and create rows for each entry
  occurrenceMap.forEach((occurrences, hyperlink) => {
    const row = document.createElement('tr');
    const hyperlinkCell = document.createElement('td');
    const occurrencesCell = document.createElement('td');

    hyperlinkCell.textContent = hyperlink;
    occurrencesCell.textContent = occurrences;

    row.appendChild(hyperlinkCell);
    row.appendChild(occurrencesCell);
    hyperlinksTableBody.appendChild(row);
  });

  // Update the hyperlink count
  // const hyperlinkCount = document.getElementById('hyperlink-count');
  // hyperlinkCount.textContent = hyperlinks.length.toString();
}
