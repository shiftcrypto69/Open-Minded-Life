/**
 * Open Minded Life - Backend Engine
 * Handles web app routing and Google Sheets data integration.
 */

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Open Minded Life')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Function to include other HTML files (Styles & JS)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Save a new post to Google Sheets
function submitPost(username, content) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Posts');
  const timestamp = new Date();
  
  sheet.appendRow([timestamp, username, content]);
  return { status: 'success' };
}

// Retrieve all posts from Google Sheets
function getPosts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Posts');
  const data = sheet.getDataRange().getValues();
  
  // Remove header row and reverse to show latest first
  const rows = data.slice(1).reverse();
  return rows;
}
