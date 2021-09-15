require('dotenv').config(); //initialize dotenv
const Discord = require("discord.js");
const { Intents } = require("discord.js");
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const CLIENT_TOKEN = process.env.CLIENT_TOKEN
const MAP_TRIGGER = '!getmap';
const MAP_BASE = 'https://maps.googleapis.com/maps/api/staticmap?'
const BADLOC_MSG = 'Bad Location specified, expected format \'47.04,-122.86\'';

function getMap(params) {
    // Start with our base url.
    let mapUrl = MAP_BASE;

    console.debug('Map Params: ', params);

    // See: https://developers.google.com/maps/documentation/maps-static/start
    const mapParameters = {
        center: `${params[1]}${params[2]}` || '',
        zoom: params[3] || '15',  // Default to 15, street/building level.
        size: params[4] || '500x500',
        scale: '', // TODO: Implement scale optional parameter.
        format: '', // TODO: Implement format option parameter.
        maptype: 'hybrid',  // Hardcoding to Hybrid for the time being
    }

    // Basic sanity test to exit early
    if(mapParameters.center.split(',').length !== 2) return BADLOC_MSG;

    // Center is required (its where we're focusing)
    mapUrl += `center=${mapParameters.center}`;

    // Zoom is optional, but the api is worthless if you dont set it.
    mapUrl += `&maptype=${mapParameters.maptype}`;

    // Size is a required parameter.
    mapUrl += `&zoom=${mapParameters.zoom}`;

    // Size is a required parameter.
    mapUrl += `&size=${mapParameters.size}`;

    // Attach our API Key
    mapUrl += `&key=${process.env.MAP_API_KEY}`;

    // Return our url.
    return mapUrl;

}

function handleMessage(msg) {
    if(msg.content.startsWith(MAP_TRIGGER)) {
        const params = msg.content.split(' ');
        const map = getMap(params);

        console.debug('Returning Map Url: ', map);

        msg.channel.send(map);
    }
}

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`) );
client.on('messageCreate', async msg => handleMessage(msg));

client.login(CLIENT_TOKEN);