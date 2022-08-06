function setJoinChannels() {
  const lastRow = targetSheet.getLastRow();
  const values = targetSheet.getRange(1, 1, lastRow, 1).getValues();
  const channelIDs = values.flat();
  console.log(channelIDs);
  return
  channelIDs.forEach(channelID => joinChannel(channelID));
}

function renameChannel(channelID,channelName) {
  const options = {
    "method": "get",
    "contentType": "application/x-www-form-urlencoded",
    "payload": {
      "token": botUserOAuthToken,
      "channel": channelID,
      "name": name
    }
  }
  const url = 'https://slack.com/api/conversations.rename';
  UrlFetchApp.fetch(url, options);
}