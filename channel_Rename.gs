function setRenameChannels() {
  const lastRow = targetSheet.getLastRow();
  const values = targetSheet.getRange(1, 1, lastRow, 2).getValues();

  values.forEach(value => renameChannel(value[0], value[1]));
}


function renameChannel(channelID, channelName) {
  const options = {
    "method": "post",
    "contentType": "application/x-www-form-urlencoded",
    "payload": {
      "token": userOAuthToken,
      "channel": channelID,
      "name": channelName
    }
  }
  const url = 'https://slack.com/api/conversations.rename';
  UrlFetchApp.fetch(url, options);
}