
# Using APP script to back-translate text
# Translating a column of the train csv to French and back to English
# Run it in the Google Sheet extension Apps Script

function translateAndBackTranslate() {
  // Enter your target language code here
  var targetLanguageCode = 'fr';
  
  // Get the active spreadsheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  
  // Get the range of cells to translate
  var range = sheet.getRange("C2:C" + sheet.getLastRow());
  
  // Get the values in the range
  var values = range.getValues();
  
  // Create a new array to store the translated values
  var translatedValues = [];
  
  // Loop through the values and translate them
  for (var i = 0; i < values.length; i++) {
    var sourceText = values[i][0];
    
    // Use the Google Translate API to translate the text
    var translatedText = LanguageApp.translate(sourceText, "", targetLanguageCode);
    
    // Use the ImTranslator tool to back-translate the translated text
    var backTranslatedText = LanguageApp.translate(translatedText,"","en")
    // var backTranslatedText = getBackTranslation(translatedText, targetLanguageCode);
    
    // Store the translated text and the back-translated text in the new array
    translatedValues.push([translatedText, backTranslatedText]);
  }
  
  // Write the translated values to the sheet
  var translatedRange = sheet.getRange("D2:E" + (values.length + 1));
  translatedRange.setValues(translatedValues);
}

function getBackTranslation(text, language) {
  // Construct the URL for the ImTranslator tool
  var url = "https://imtranslator.net/translation/" + language + "/auto/back-translation/";

  // Make a POST request to the ImTranslator tool to get the back-translation
  var options = {
    'method': 'post',
    'payload': {
      'text': text,
      'act': 'Back Translation'
    }
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var html = response.getContentText();
  
  // Parse the HTML to get the back-translation
  var startTag = '<div class="back-translation-text">';
  var endTag = '</div>';
  var startIndex = html.indexOf(startTag) + startTag.length;
  var endIndex = html.indexOf(endTag, startIndex);
  var backTranslatedText = html.substring(startIndex, endIndex);
  
  return backTranslatedText;
}
