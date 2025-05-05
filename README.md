# WeatherNotify (天気予報通知アプリ)

このプロジェクトでは、**毎日の天気予報をLINEに通知し、Googleスプレッドシートに記録する** アプリを開発します。  プログラミング初心者の方でも楽しく学べるよう、シンプルなコード設計になっています。  「毎日の天気を手軽に確認したい」「記録を残したい」といったニーズに対応できます！

## 使用技術
| 技術 | 詳細 |
|------|------|
| **開発言語** | Google Apps Script (GAS) |
| **通知サービス** | LINE Messaging API |
| **データ管理** | Googleスプレッドシート |

---

## インストール方法
### リポジトリをクローン
```txt
git clone https://github.com/Nakkinakki55/WeatherNotify.git
cd WeatherNotify
```

## デプロイ方法
デプロイする手順については、以下の記事を参考にするとスムーズに進められます。
[初心者向け！毎日の天気予報をLINEに通知し、Googleスプレッドシートに記録するアプリを作成しよう #JavaScript - Qiita](https://qiita.com/nishifeoda/items/7e458b261111f201c724)

## Google Apps Script の設定
1. Googleスプレッドシートを開き、新しいシートを作成
2. Apps Script を開き、以下のコードを貼り付けて保存
```js
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
```

## 毎日自動実行の設定
1. Apps Script の「トリガー」設定を開く 
2. sendLineMessage を 毎日実行 に設定（時間は8:00推奨） 
3. 保存して完了！ 
