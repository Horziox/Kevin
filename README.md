# Guizmo
[![Build Status](http://img.shields.io/travis/badges/badgerbadgerbadger.svg?style=flat-square)](https://travis-ci.org/badges/badgerbadgerbadger) [![Coverage Status](http://img.shields.io/coveralls/badges/badgerbadgerbadger.svg?style=flat-square)](https://coveralls.io/r/badges/badgerbadgerbadger) [![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

A french private Discord bot, but open source ! :tada:
Yon can find all release and patch notes [here](https://github.com/Horziox/Guizmo/releases) !

## Table of Contents
- [Installation](#installation)
- [Commands](#commands)
- [Features](#features)
- [License](#license)

## Installation
### Clone

- Clone this repo to your local machine using `https://github.com/Horziox/Guizmo.git`

### NodeJs and NPM

- Install Nodejs and NPM [here](https://nodejs.org/en/)

### Install dependencies

Install all dependencies (You can find there in the [package.json](https://github.com/Horziox/Guizmo/blob/master/.gitignore/package.json))

### Setup
In the index.js, change
```javascript
bot.login(process.env.token)
```
by
```javascript
bot.login("yourDiscordTokenHere")
```
*You can find your DIscord token [here](https://discord.com/developers/applications) after you have created a new Application => Bot*


:warning: **Delete commands don't intersest you or edit there !**

### Run
```
node index.js
```


## Commands
### Roles
- **!apex**
- **!fortnite**
- **!minecraft** 
### Fortnite
- **!news** *Generate a GIF who indicate the Fortnite Battle Royale news in game*
- **!stats** *Generate an image with Fortnite stats of the player*
### Admin
- **!eval** *Eval command*
### General
- **!help** *Display the bot commands*
- **!info** *Give the server, bot or users discord informations*
- **!pfc** *Play Rock Paper Cissor with Guizmo*
- **!ping**


## Features

- Fortnite Shop image
- Apex Legends commands
- Moderation commands

And more !

## License

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2020 ©
