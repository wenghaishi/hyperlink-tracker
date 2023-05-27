// This script runs in the background

let trackedHyperlinks = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
      chrome.tabs.sendMessage(tabId, { action: "scanHyperlinks" });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendHyperlinks") {
    const hyperlinks = message.hyperlinks;

    // Update the tracked hyperlinks with new data
    trackedHyperlinks = updateTrackedHyperlinks(hyperlinks);

    // Log the updated hyperlinks in the background console
    console.log(trackedHyperlinks);

    // Send the updated hyperlinks to the popup
    chrome.runtime.sendMessage({
      action: "updatePopupHyperlinks",
      hyperlinks: updateTrackedHyperlinks(hyperlinks),
    });

    sendResponse(); // Send an empty response
  }
});

function updateTrackedHyperlinks(hyperlinks) {
  // Merge the new hyperlinks with the existing ones
  const mergedHyperlinks = trackedHyperlinks.concat(hyperlinks);
  // Remove duplicate hyperlinks (if desired)
  const uniqueHyperlinks = Array.from(new Set(mergedHyperlinks));
  // Sort the hyperlinks alphabetically (if desired)
  const sortedHyperlinks = uniqueHyperlinks.sort();
  chrome.runtime.sendMessage({ hyperlinks: sortedHyperlinks });
  console.log(sortedHyperlinks);
  return sortedHyperlinks;
  // Send the hyperlinks to the popup script
}
