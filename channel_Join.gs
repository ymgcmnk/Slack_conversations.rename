function setJoinChannels() {
  const lastRow = targetSheet.getLastRow();
  const values = targetSheet.getRange(1, 1, lastRow,1).getValues();
  const channelIDs = values.flat();
  console.log(channelIDs);
  return
  channelIDs.forEach(channelID => joinChannel(channelID));
}

function joinChannel(channelID) {
  const options = {
    "method": "get",
    "contentType": "application/x-www-form-urlencoded",
    "payload": {
      "token": botUserOAuthToken,
      "channel": channelID
    }
  }
  const url = 'https://slack.com/api/conversations.join';
  UrlFetchApp.fetch(url, options);
}