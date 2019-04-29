// Require
const BBCMicrobit = require('bbc-microbit');
const http = require('http');

// Setting OpenWeaterMap API data
const appid = "cf005b29c4fa86488c5acba2062e4626";
const id = "1853909";
const today_url = "http://api.openweathermap.org/data/2.5/weather?id=" + id + "&units=metric&appid=" + appid;
const tomorrow_url = "http://api.openweathermap.org/data/2.5/forecast?id=" + id +"&units=metric&cnt=2&appid=" + appid;

const send_pattern = {
	// 非表示
	"None": {
		"value": new Buffer('0000000000', 'hex'),
	},
	// 晴れ
	"Clear": {
		// * * *
		//  ***
		// ** **
		//  ***
		// * * *
		"value": new Buffer('150E1B0E15', 'hex'),
	},
	// 曇り
	"Clouds": {
		//   **
		//  *  *
		// *   *
		//  ***
		"value": new Buffer('000609110E', 'hex'),
	},
	// 雨
	"Rain": {
		//   *
		//  * *
		// *****
		//   *
		//   ***
		"value": new Buffer('040A1F0407', 'hex'),
	},
	// 雷雨
	"Thunderstorm": {
		//   *
		//  *
		// *****
		//    *
		//   *
		"value": new Buffer('04081F0204', 'hex'),
	},
	// 雪
	"Snow": {
		//   *
		//  * *
		//   *
		//  * *
		// *****
		"value": new Buffer('040A040A1F', 'hex'),
	},
	// 霧
	"Mist": {
		//   *
		// ***
		//   *
		//  ***
		//  ***
		"value": new Buffer('041C040E0E', 'hex'),
	}
};

function printConsoleOpeing()
{
	console.log("Hello!! Welcome to micro:Wether!!");
	console.log("=================================================");
	console.log("");
	console.log("    *****************************************    ");
	console.log("   *     +    +    +        *************    *   ");
	console.log("  *       +   +   +        *             *    *  ");
	console.log(" *         + *** +        *               *    * ");
	console.log("*           *   *        *******************    *");
	console.log("*     + + + *   * + + +           |             *");
	console.log("*           *   *                 |             *");
	console.log(" *         + *** +                |            * ");
	console.log("  *       +   +   +               |    /      *  ");
	console.log("   *     +    +    +               ----      *   ");
	console.log("    *****************************************    ");
	console.log("");
	console.log("=================================================");
	return;
}

function printConsoleUsageEnglish()
{
	console.log("=====================English=====================");
	console.log("How to connect:");
	console.log("\t 1. Start this program with RaspberryPi(You can start if you look at this description).");
	console.log("");
	console.log("\t ===== WARNING!! =====");
	console.log("\t   This use the Bluetooth function. So, turn on the function of Bluetooth and");
	console.log("\t   please execute with administrator authority or a user with authority.");
	console.log("\t =====================");
	console.log("");
	console.log("\t\t Example) sudo node main.js");
	console.log("");
	console.log("\t 2. Start micro:bit which has a dedicated program");
	console.log("");
	console.log("\t 3. The connection will be made automatically, and if successful, mac address etc. will be displayed");
	console.log("");
	console.log("Usage:");
	console.log("\t A Button:");
	console.log("\t\t Display today's weather for 30 seconds");
	console.log("\t B Button:");
	console.log("\t\t Display the tomorrow's weather for 30 seconds");
	console.log("");
	console.log("Author:");
	console.log("\t Author:FlaxBear");
	console.log("\t e-Mail:flaxbear.github@gmail.com");
	console.log("\t Send feedback, questions or bug reports about this program via e-Mail");
	console.log("==================================================");
	return;
}

function printConsoleUsageJapanese()
{
	console.log("=====================日本語=====================");
	console.log("接続方法:");
	console.log("\t 1. このプログラムをラズペリーパイで起動してください(このメッセージが起動していれば大丈夫ですけど...)");
	console.log("");
	console.log("\t ===== 注意 =====");
	console.log("\t   このプログラムはBluetoothを使用しています. Bluetoothを起動するのと");
	console.log("\t   管理者権限,あるいはsudoコマンドを使用して起動するようにしてください.");
	console.log("\t =====================");
	console.log("");
	console.log("\t\t 例) sudo node main.js");
	console.log("");
	console.log("\t 2. micro:bitに専用のプログラムを入れ,起動してください.");
	console.log("");
	console.log("\t 3. 接続は自動で行われます.接続に成功すると,maxアドレスなどが表示されます.");
	console.log("");
	console.log("使用方法:");
	console.log("\t Aボタン:");
	console.log("\t\t 今日の天気をディスプレイに30秒間表示します.");
	console.log("\t Bボタン:");
	console.log("\t\t 明日の天気をディスプレイに30秒間表示します.");
	console.log("制作者:");
	console.log("\t 制作者:FlaxBear");
	console.log("\t メールアドレス:flaxbear.github@gmail.com");
	console.log("\t 感想、ご意見、バグ報告などはメールアドレスにてご報告お願いします.");
	console.log("==============================================");
	return;
}

function startMicroWether()
{
	console.log("\t* Connect micro:bit Bluetooth");
	BBCMicrobit.discover(function(microbit) {
		// Connected
		console.log('\t* Success!! Connected microbit: id = %s, address = %s', microbit.id, microbit.address);

		// Disconnected
		microbit.on('disconnect', function() {
			console.log('\t* micro:bit disconnected');
			console.log('\t Good Bye!!');
			process.exit(0);
		});

		// Button A
		microbit.on('buttonAChange', function(value) {
			if(value == 1) {
				getTodayWeather(microbit);
			}
		});

		// Button B
		microbit.on('buttonBChange', function(value) {
			if(value == 1) {
				getTomorrowWeather(microbit);
			}
		});

		microbit.connectAndSetUp(function() {
			microbit.subscribeButtons(function() {});
		});
	});
}

function getTodayWeather(microbit) {
	http.get(today_url, function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('data', function() {
			var weather_data = JSON.parse(body);
			var today_weather = weather_data['weather'][0]['main'];
			var send_data = send_pattern[today_weather]["value"];
			microbit.writeLedMatrixState(send_data, function(){});
			setTimeout(function() {
				send_data = send_pattern["None"]["value"];
				microbit.writeLedMatrixState(send_data, function(){});
			}, 30000);
		});
	});
}

function getTomorrowWeather(microbit) {
	http.get(tomorrow_url, function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('data', function() {
			var weather_data = JSON.parse(body);
			var tomorrow_weather = weather_data['list'][1]['weather'][0]['main'];
			var send_data = send_pattern[tomorrow_weather]["value"];
			microbit.writeLedMatrixState(send_data, function(){});
			setTimeout(function() {
				send_data = send_pattern["None"]["value"];
				microbit.writeLedMatrixState(send_data, function(){});
			}, 30000);
		});
	});
}

function main()
{
	printConsoleOpeing();
	printConsoleUsageEnglish();
	printConsoleUsageJapanese();
	startMicroWether();
}

main();