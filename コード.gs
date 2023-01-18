// ChatGPTのAPIを呼び出し応答をリターン
function getChatGptMessage(message) {
  var uri = 'https://api.openai.com/v1/completions';
  var API_KEY = "API_KEY"
  var headers = {
    'Authorization': "Bearer " + API_KEY,
    'Content-type': 'application/json'
  };

  var options = {
    'muteHttpExceptions' : true,
    'headers': headers, 
    'method': 'POST',
    'payload': JSON.stringify({
      "model": "text-davinci-003",
      "max_tokens" : 2048,
      "prompt": message})
  };
  try {
      const response = UrlFetchApp.fetch(uri, options);
      var json=JSON.parse(response.getContentText());
      //結果の文字列をpre_resultsに入れる
      pre_results = json["choices"][0]["text"];
      //デフォルトで入っているすべての改行を、""（空文字）と置き換える
      results = pre_results.replace(/\n/g, "");
      return results;
  } catch(e) {
    console.log('error');
  }
}

//メッセージを受け取ったときにeオブジェクトを取得
function doPost(e) {
  let token = "TOKEN_LONG";
  // JSONデータとして取得
  let eventData = JSON.parse(e.postData.contents).events[0];
  // JSONデータからreply用のトークンを取得
  let replyToken = eventData.replyToken;
  // JSONデータからメッセージを取得
  let userMessage =　eventData.message.text;
  //追加する命令を記述
  let orderMessage = "以下の要求を、わかりやすく、読みやすく、丁寧で優しく、かわいい言葉遣いで、絵文字を使って要約して、整理して下さい。\n要求：\n"
  // 応答メッセージ用のAPI URLを定義
  let url = 'https://api.line.me/v2/bot/message/reply';
  // JSONメッセージからreplyメッセージを準備
  let replyMessage = orderMessage + userMessage;

  //定義したチャットGPTが返答したメッセージをtextをもつペイロード値を設定
  let payload = {
    'replyToken': replyToken,
    'messages': [{
        'type': 'text',
        'text': getChatGptMessage(replyMessage)
      }]
  };
  //HTTPSのPOSTパラメータを設定
  let options = {
    'payload' : JSON.stringify(payload),
    'myamethod'  : 'POST',
    'headers' : {"Authorization" : "Bearer " + token},
    'contentType' : 'application/json'
  };
  //LINE Messaging APIにリクエストして返答
  UrlFetchApp.fetch(url, options);
}
