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

/**
 * Fungsi untuk menyertakan fail HTML lain (Styles, JavaScript)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Fungsi untuk mengambil data dari Google Sheets
 * Mengambil semua data dan menyusunnya supaya yang terbaru di atas.
 */
function getPosts() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Posts'); // Pastikan nama tab di Sheets adalah 'Posts'
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) return []; // Jika hanya ada header atau kosong

    // Ambil semua data kecuali header, kemudian terbalikkan (reverse)
    return data.slice(1).reverse();
  } catch (e) {
    console.error("Error fetching posts: " + e.toString());
    return [];
  }
}

/**
 * Fungsi untuk menyimpan post baru ke Google Sheets
 * Kolum: [0] Timestamp, [1] Username, [2] Content
 */
function submitPost(username, content) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Posts');
    const timestamp = new Date();
    
    sheet.appendRow([timestamp, username, content]);
    return true; // Mengembalikan boolean untuk diproses oleh SuccessHandler
  } catch (e) {
    console.error("Error submitting post: " + e.toString());
    return false;
  }
}
