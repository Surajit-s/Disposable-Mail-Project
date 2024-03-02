const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const bot = new TelegramBot('6319019022:AAGdxhdAs_NfWuiXZ5RwPH_-r9GDNHiDIfk', { polling: true });
let currentDisposableEmail = '';
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || 'not set';
  bot.sendMessage(chatId, `Hello 👋 ${msg.from.first_name}`)
    .then(() => {
      bot.sendMessage(chatId, `Why Disposablemailbot ?

Our Bot Offers 🎉 

📧 Temporary Email Service
Welcome to our Temporary Email Service! Need a quick email address for verification or temporary communication? Our service offers disposable email addresses that you can use on-the-fly. 

🔒 Privacy Guaranteed
Your privacy matters to us. Our disposable email addresses help you keep your inbox clutter-free and your personal email address private. No need to worry about spam or unwanted emails cluttering your primary inbox.

🕒 Short-lived Addresses
Our temporary email addresses are designed to be short-lived. Once you're done with them, they'll automatically expire, ensuring your inbox stays clean and clutter-free.

🚀 Fast and Easy
Getting a temporary email address is as easy as sending a message to our bot. No sign-ups or registrations required. Just start a conversation with us and get your disposable email address instantly!

🛡️ Security
Our service is secure and reliable. Rest assured that your temporary email communications are protected, and your sensitive information remains confidential.

type /email to get disposable mail 🚀 \n 
type /info for information or assistance ℹ`);
})
    .catch((error) => {
      console.error('Error sending messages:', error);
    });
});

// Handle /info command
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'For more information or assistance, please contact the developer:\n\nSurajit Sen\nTelegram: @sensurajit');
});

// Handle /email command
bot.onText(/\/email/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    // Make a request to 1secmail API to get a disposable email address
    const response = await axios.get('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');

    currentDisposableEmail = response.data[0];
    bot.sendMessage(chatId, `Here is your disposable email address: ${currentDisposableEmail} \n to view latest mails type /fetchemails`);
  } catch (error) {
    console.error('Error retrieving disposable email address:', error);
    bot.sendMessage(chatId, 'Error retrieving disposable email address. Please try again later.');
  }
});

// Handle /fetchemails command
bot.onText(/\/fetchemails/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    if (!currentDisposableEmail) {
      bot.sendMessage(chatId, 'No disposable email address available. Please generate one using the /email command.');
      return;
    }

    // Make a request to 1secmail API to fetch emails for the current disposable email address
    const response = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${currentDisposableEmail.split('@')[0]}&domain=${currentDisposableEmail.split('@')[1]}`);

    const emails = response.data;
    if (emails.length === 0) {
      bot.sendMessage(chatId, 'No emails found for the current disposable email address.');
      return;
    }

    let message = 'Here are the latest emails:\n\n';
    emails.forEach((email, index) => {
      message += `Email ${index + 1}:\n`;
      message += `From: ${email.from}\n`;
      message += `Subject: ${email.subject}\n\n`;
    });

    bot.sendMessage(chatId, message);
  } catch (error) {
    console.error('Error fetching emails:', error);
    bot.sendMessage(chatId, 'Error fetching emails. Please try again later.');
  }
});

// Handle errors
bot.on('polling_error', (error) => {
  console.log(error);
});

console.log('Bot is running...');
