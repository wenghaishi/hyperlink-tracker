chrome.runtime.sendMessage({ action: "getDetails" }, function(response) {
  var detailsTableBody = document.getElementById("detailsTableBody");

  response.details.forEach(function(detail) {
    var row = document.createElement("tr");
    var visitedSiteCell = document.createElement("td");
    var hyperlinkCell = document.createElement("td");
    var occurrencesCell = document.createElement("td");

    visitedSiteCell.textContent = detail.visitedSite;
    hyperlinkCell.textContent = detail.hyperlink;
    occurrencesCell.textContent = detail.occurrences;

    row.appendChild(visitedSiteCell);
    row.appendChild(hyperlinkCell);
    row.appendChild(occurrencesCell);

    detailsTableBody.appendChild(row);
  });
});
