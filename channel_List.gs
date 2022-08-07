// 参照した資料
// https://shiimanblog.com/engineering/public-channels/#toc9


/**
 * Main Execution method.
 * 実行メソッド.
 */
function setChannelInfo() {
  public_channels = getChannelList("public_channel");
  const public_channels_array = public_channels.map(channel => [channel.id, channel.name, channel.topic.value, channel.purpose.value]);
  const headers = ["channel.id", "channel.name", "channel.topic.value", "channel.purpose.value"];
  public_channels_array.unshift(headers)
  const today = Utilities.formatDate(new Date(), 'JST', 'YYYYMMdd_HH:mm:ss');
  const newSheet = ss.insertSheet();
  newSheet.setName("channelList_"+today);
  newSheet.getRange(1, 1, public_channels_array.length, public_channels_array[0].length).setValues(public_channels_array);
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