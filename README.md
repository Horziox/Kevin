# Kevin

A Little NodeJS bot with fortnite-api.com integrations
You can also use this repo for create your own bot or just [invite](https://discord.com/oauth2/authorize?client_id=739849791168577608&scope=bot&permissions=322624) Kevin
Don't hesitate to join the [Homebase server](https://discord.gg/7XyNM4p) !

## Table of Contents
- [Installation](#installation)
- [Commands](#commands)
- [Features](#features)
- [License](#license)

## Installation
### Clone

- Clone this repo to your local machine using `https://github.com/Horziox/Kevin.git`

### NodeJs and NPM

- Install Nodejs and NPM [here](https://nodejs.org/en/)

### Install dependencies

Install all dependencies (You can find there in the [package.json](https://github.com/Horziox/Kevin/blob/master/package.json)) or run `npm install` command

### Setup
Change values in the index.js file in ressources folder as you want
In the index.js, change
```javascript
bot.login(process.env.discordToken)
```
by
```javascript
bot.login("yourDiscordTokenHere")
```
Or create an .env file with `discordToken=mytoken` in value !

*You can find your Discord token [here](https://discord.com/developers/applications) after you have created a new Application => Bot*


:warning: __**Delete or modify files are on your own riks !**__

### Run
```
npm start
```
or
```
node src/index
```


## Commands
### About the bot
- **info**
- **help**
- **invite**
- **ping**
### Fortnite
- **aes** *Get current aes keys*
- **blog** *Return 5 last blogs from [here](https://www.epicgames.com/fortnite/en-US/news)*
- **cos** *Find an BR cosmetics*
- **leaks** *Display news cosmetics from the last update (image)*
- **news** *Generate a GIF who indicate the Fortnite Battle Royale news in game*
- **shop** *Get the current BR shop (image)*
- **stats** *Generate an image with Fortnite stats of an player*
- **status** *Get the servers status of differents services*


## Features
Have an idea ?
Submit it !

## License

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2021 ©
