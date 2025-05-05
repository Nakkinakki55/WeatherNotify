// LINEにメッセージを送信
function sendLineMessage() {
    const accessToken = 'YOUR_ACCESS_TOKEN'; // ここに取得したアクセストークンを入力
    const userId = 'YOUR_USER_ID'; // 送信先のユーザーIDを入力
  
    const message = fetchWeatherForecast(); // 天気予報のメッセージ取得
  
    const url = 'https://api.line.me/v2/bot/message/push';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
    };
    const payload = {
      to: userId,
      messages: [{ type: 'text', text: message }],
    };
  
    const options = { method: 'post', headers, payload: JSON.stringify(payload) };
    UrlFetchApp.fetch(url, options);
  }
  
  // 天気予報を取得
  function fetchWeatherForecast() {
    const url = "https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json";
    try {
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());
  
      let msg = "東京都の天気予報\n-------------\n";
      msg += "今日: " + data[0].timeSeries[0].areas[0].weathers[0] + "\n";
      msg += "明日: " + data[0].timeSeries[0].areas[0].weathers[1];
  
      recordWeatherData("東京都", data[0].timeSeries[0].areas[0].weathers[0]);
      return msg;
    } catch (error) {
      return "エラー: " + error.message;
    }
  }
  
  // スプレッドシートへ記録
  function recordWeatherData(cityName, weather) {
    const sheetName = "天気記録";
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  
    sheet.appendRow([new Date(), cityName, weather]);
  }
  