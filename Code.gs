
function onOpen() {
 SpreadsheetApp
   .getUi()
   .createMenu("Icypeas")
   .addItem("Hunter Api", "Sidebar")
   .addToUi();
}

function Sidebar() {
 var widget = HtmlService.createHtmlOutputFromFile("APIKeyinput.html");
 widget.setTitle("Icypeas add-on");
 SpreadsheetApp.getUi().showSidebar(widget);
}

function saveApiKey(apiKey) {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('API_KEY', apiKey);
}


function FindEmail(FN, LN, CY) {
  const userProperties = PropertiesService.getUserProperties();
  const apiKey = userProperties.getProperty('API_KEY');

  if (!apiKey) {
    showToast('No API Key found. Please set the API Key first.');
    return 'No API Key found. Please set the API Key first.';
  } 

  const url = `https://api.hunter.io/v2/email-finder?domain=${CY}&first_name=${encodeURIComponent(FN)}&last_name=${encodeURIComponent(LN)}&api_key=${apiKey}`;

  try {
    const response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    
    if (responseCode >= 200 && responseCode < 300) {
      const data = JSON.parse(responseBody);

      if (data.errors && data.errors.length > 0) {
        const errorMessage = data.errors[0].details;
        showToast('Error: ' + errorMessage);
        return 'Error: ' + errorMessage;
      }

      if (data.data && data.data.email) {
        return data.data.email;
      } else {
        return 'Email not found';
      }
    } else {
      const errorData = JSON.parse(responseBody);
      if (errorData.errors && errorData.errors.length > 0) {
        const errorMessage = errorData.errors[0].details;
        showToast('Error: ' + errorMessage);
        return 'Error: ' + errorMessage;
      } else {
        showToast('Unknown error occurred.');
        return 'Unknown error occurred.';
      }
    }
  } catch (error) {
    showToast('Error: ' + error.message);
    return 'Error: ' + error.message;
  }
}

function showToast(message) {
  SpreadsheetApp.getActiveSpreadsheet().toast(message);
}


