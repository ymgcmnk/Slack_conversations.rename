// 参照した資料
// https://shiimanblog.com/engineering/public-channels/#toc9




/**
 * Main Execution method.
 * 実行メソッド.
 */
function setChannelInfo() {
  deleteSpredsheetList();
  // users = getSlackUsers();
  public_channels = getChannelList("public_channel");
  for (let i = 0; i < public_channels.length; i++) {
    sheet.getRange(i + 5, 2).setValue(public_channels[i].name);
    sheet.getRange(i + 5, 3).setValue(public_channels[i].id);
    // sheet.getRange(i + 5, 3).setValue(public_channels[i].topic.value);
    sheet.getRange(i + 5, 4).setValue(public_channels[i].purpose.value);
    // for (let j = 0; j < users.length; j++) {
    //   if (users[j].id == public_channels[i].creator) {
    //     sheet.getRange(i + 5, 5).setValue(users[j].real_name + "(" + users[j].name + ")");
    //     break;
    //   }
    // }
  }
  sheet.getRange(2, 5).setValue(public_channels.length);
}

// // slackユーザ取得.
// function getSlackUsers() {
//   let options = {
//     "method": "get",
//     "contentType": "application/x-www-form-urlencoded",
//     "payload": {
//       "token": token
//     }
//   }
//   // 必要scope = users:read.
//   let url = 'https://slack.com/api/users.list';
//   let response = UrlFetchApp.fetch(url, options);
//   let obj = JSON.parse(response);
//   return obj.members;
// }



/**
 * Function to delete a spreadsheet values
 * チャンネルリストを消し込む.
 */
function deleteSpredsheetList() {

  const deleteLength = 2000;   // 削除するレコード数.

  for (let i = 0; i < deleteLength; i++) {
    sheet.getRange(i + 5, 2).setValue("")
    sheet.getRange(i + 5, 3).setValue("")
    sheet.getRange(i + 5, 4).setValue("")
    sheet.getRange(i + 5, 5).setValue("")
  }
  sheet.getRange(2, 5).setValue(0);
}


/**
 * Function to get channel list via API.
 * チャンネルリスト ページャー対応.
 * 
 * @param {string} types - Optional arguments of Slack API. 
 * @return {object} channelList - Slack channel list
 * 
 * NOTE: Need to specify cursor to get more than 1000 pieces of information.
 * NOTE: https://api.slack.com/methods/conversations.list
 */
function getChannelList(types) {
  const maxPager = 10;   // ページャーの最大数.
  let count = 1;
  let channelList = [];
  let cursor = "";
  while (count <= maxPager) {
    channelObj = getChannelObject(types, cursor);
    channelList = channelList.concat(channelObj.channels);
    if (channelObj.response_metadata.next_cursor == "") {
      break;
    }
    cursor = channelObj.response_metadata.next_cursor;
    // console.log(cursor);
    // console.log(typeof cursor);
    count++;
  }

  return channelList;
}


/**
 * Function to get channel list via API.
 * APIでチャンネルリストを取得する。
 * 
 * @param {string} types - Optional arguments of Slack API. 
 * @param {string} cursor - Optional arguments of Slack API. 
 * @return {object} obj - Slack channel list
 * 
 * NOTE: Need to specify cursor to get more than 1000 pieces of information.
 * NOTE: https://api.slack.com/methods/conversations.list
 */
function getChannelObject(types, cursor) {
  const options = {
    "method": "get",
    "contentType": "application/x-www-form-urlencoded",
    "payload": {
      "token": botUserOAuthToken,
      "limit": 1000,
      "exclude_archived": true,
      "types": types,
      "cursor": cursor
    }
  }
  const url = 'https://slack.com/api/conversations.list';
  const response = UrlFetchApp.fetch(url, options);
  const obj = JSON.parse(response);
  return obj;
}