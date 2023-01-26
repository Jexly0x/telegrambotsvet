const TelegramBot = require('node-telegram-bot-api');
const ping = require('ping');

// Replace YOUR_TOKEN with your actual bot token
const token = '5442308942:AAH4lkk-r_BXUzbFKmnfG-hbOUPiqrZrs7E';

// Replace CHANNEL_ID with the actual chat ID of the Telegram channel
const chatId = '-1001637620976';

// Replace IP_ADDRESS with the actual IP address you want to ping
const IP_ADDRESS = '212.90.39.199';

// Create a new Telegram bot
const bot = new TelegramBot(token, {polling: true});

let firstRun = true;
let pingStartTime;

console.log("Bot running");

// Function that pings the IP address and sends messages to the Telegram channel
function pingAndSendMessage() {
    ping.promise.probe(IP_ADDRESS)
        .then(res => {
            if (res.alive) {
                // If the first run and ping is successful
                if (firstRun) {
                    bot.sendMessage(chatId, 'Bot started. Connected to electricity');
                    firstRun = false;
                } else if (pingStartTime) {
                    const timeDiff = process.hrtime(pingStartTime);
                    const diffInSeconds = timeDiff[0];
                    const hours = Math.floor(diffInSeconds / 3600);
                    const minutes = Math.floor((diffInSeconds - (hours * 3600)) / 60);
                    const seconds = diffInSeconds - (hours * 3600) - (minutes * 60);
                    bot.sendMessage(chatId, `Electricity on. Time since last interruption: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
                }
                pingStartTime = null;
            } else {
                if (!pingStartTime) {
                    pingStartTime = process.hrtime();
                }
                const timeDiff = process.hrtime(pingStartTime);
                const diffInSeconds = timeDiff[0];
                const hours = Math.floor(diffInSeconds / 3600);
                const minutes = Math.floor((diffInSeconds - (hours * 3600)) / 60);
                const seconds = diffInSeconds - (hours * 3600) - (minutes * 60);
                bot.sendMessage(chatId, `Electricity off. Time since last successful ping: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
            }
        });
}

// Execute the ping and send message function every minute
setInterval(pingAndSendMessage, 5000);




































/*const TelegramBot = require('node-telegram-bot-api');
const exec = require('child_process').exec;

// replace with your own values
const token = '5442308942:AAH4lkk-r_BXUzbFKmnfG-hbOUPiqrZrs7E';
const groupChatId = '-1001637620976';
const ipAddress = '212.90.39.199';

const bot = new TelegramBot(token, { polling: true });
let lastPingSuccessful;
let lastPingUnsuccessful;
let isSuccessful = true;

function checkIP() {
    exec(`ping -c 1 ${ipAddress}`, (error, stdout, stderr) => {
        if (!error) {
            if (!isSuccessful) {
                isSuccessful = true;
                let now = new Date();
                let timeSinceLastPing = "first ping";
                if (lastPingSuccessful) {
                    let diff = now - lastPingSuccessful;
                    let hours = Math.floor(diff / 1000 / 60 / 60);
                    let minutes = Math.floor(diff / 1000 / 60) % 60;
                    let seconds = Math.floor(diff / 1000) % 60;
                    timeSinceLastPing = `Last ping was ${hours} hour(s) ${minutes} minute(s) and ${seconds} second(s) ago.`
                    lastPingSuccessful = now;
                    bot.sendMessage(groupChatId, "ping successful\n" + timeSinceLastPing);
                }
            } else {
                if (isSuccessful) {
                    isSuccessful = false;
                    let now = new Date();
                    let timeSinceLastPing = "first ping";
                    if (lastPingUnsuccessful) {
                        let diff = now - lastPingUnsuccessful;
                        let hours = Math.floor(diff / 1000 / 60 / 60);
                        let minutes = Math.floor(diff / 1000 / 60) % 60;
                        let seconds = Math.floor(diff / 1000) % 60;
                        timeSinceLastPing = `Last ping was ${hours} hour(s) ${minutes} minute(s) and ${seconds} second(s) ago.`;
                    }
                    lastPingUnsuccessful = now;
                    bot.sendMessage(groupChatId, "ping unsuccessful\n" + timeSinceLastPing);
                }
            }
        }
    });
}

console.log("bot running");
checkIP();
setInterval(checkIP, 5000);*/