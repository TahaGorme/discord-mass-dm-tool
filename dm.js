//Importing Modules .
const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');

const chalk = require('chalk');
// Config
const config = require('./config');
let dm_delay_min = config.dm_delay_min;
let dm_delay_max = config.dm_delay_max;
let dm_message = config.dm_messages;
let login_delay_min = config.login_delay_min;
let login_delay_max = config.login_delay_max;
// .

//Error Handling
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
})
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
})
console.log(`Note: This is a free version of my mass dm tool. This free version will NOT scrape the members. you will need manually put the user ids in the free version. This free version will NOT solve any captchas. The free version is not designed for mass dming on a larger scale. The tokens may get locked when using the free version as the free version does NOT have proxy support. To purchase the paid version that will automatically scrape and automatically solve captchas and mass dm on a larger scale without getting locked with proxy support, contact me on discord @uutu or on telegram @tahagorme https://discord.gg/acoustic`)

//Initializing Variables
let tokens = fs.readFileSync('tokens.txt', 'utf8').replace(/\r/g, '').split('\n').filter(x => x);
let i = 0;
let serverId = fs.readFileSync('serverId.txt', 'utf8').replace(/\r/g, '');
let listOfMembers = fs.readFileSync('members.txt', 'utf8').replace(/\r/g, '').split('\n').filter(x => x);

tokens.forEach(token => {
    setTimeout(async () => {
        await login(token, serverId);
    }, randomInt(login_delay_min, login_delay_max) * (++i));
});


async function login(token, serverId) {
    const client = new Client({
        captchaSolver: function (a,b) {
            return console.log("GOT A CAPTCHA, PLEASE PURCHASE THE PAID VERSION TO BYPASS THE CAPTCHA")
        },

    });

    client.on('ready', async () => {
        console.log(`${chalk.magentaBright('[INFO]')} ${chalk.cyan(client.user.tag)}: ${chalk.whiteBright(`Logged in`)}`);
        setInterval(async () => {
            let randomMember = listOfMembers[Math.floor(Math.random() * listOfMembers.length)];
            let member = randomMember;

            let user = await client.users.fetch(member);
            console.log(`${chalk.magentaBright('[INFO]')} ${chalk.cyan(client.user.tag)}: ${chalk.whiteBright(`Dms Opened with ${chalk.underline(user.tag)}`)}`);
            //send dm
            let randomMessage = dm_message[Math.floor(Math.random() * dm_message.length)];
            user.send(randomMessage).then(() => {
                console.log(`${chalk.greenBright(`[SUCCESS]`)} ${chalk.cyan(client.user.tag)}: ${chalk.whiteBright(`DM sent to ${chalk.underline(user.tag)}`)}`);
                //remove member from members.txt
                fs.writeFileSync('members.txt', fs.readFileSync('members.txt', 'utf8').replace(member + '\n', ''));
                //remove member from listOfMembers
                listOfMembers = listOfMembers.filter(x => x !== member);

            }).catch((error) => {
                console.log(`${chalk.redBright(`[ERROR]`)} ${chalk.cyan(client.user.tag)}: ${chalk.whiteBright(`Error sending DM to ${chalk.underline(user.tag)}`)}`);
                console.log(`Error: ${error}`);
            });
        }, randomInt(dm_delay_min, dm_delay_max) * (++i));

    });

    client.login(token).catch((error) => {
        if (error.toString()?.includes("INVALID") && error.toString()?.includes("TOKEN")) {
            console.log(`${chalk.redBright(`[ERROR]`)} ${chalk.whiteBright(`Invalid Token: ${token}`)}`);
            //removing invalid token from tokens.txt
            fs.writeFileSync('tokens.txt', fs.readFileSync('tokens.txt', 'utf8').replace(token, ''));
            console.log(`Removed Invalid Token: ${token}`);
        }
    }).catch((error) => {
        console.error('Unhandled promise rejection:', error);
    });
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
