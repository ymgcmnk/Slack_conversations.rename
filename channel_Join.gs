function setJoinChannels() {
  const lastRow = targetSheet.getLastRow();
  const values = targetSheet.getRange(1, 1, lastRow, 1).getValues();
  const channelIDs = values.flat();

  channelIDs.forEach(channelID => joinChannel(channelID));
}

function joinChannel(channelID) {
  const options = {
    "method": "post",
    "contentType": "application/x-www-form-urlencoded",
    "payload": {
      "token": botUserOAuthToken,
      "channel": channelID
    }
  }
  const url = 'https://slack.com/api/conversations.join';
  UrlFetchApp.fetch(url, options);
}