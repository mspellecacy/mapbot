require('dotenv').config(); //initialize dotenv
const Discord = require("discord.js");
const { Intents } = require("discord.js");
const CLIENT_TOKEN = process.env.CLIENT_TOKEN;
const MAP_API_KEY = process.env.MAP_API_KEY;
const MAP_TRIGGER = '!getmap';
const MAP_HELP_TRIGGER = 'help';
const MAP_BASE = 'https://maps.googleapis.com/maps/api/staticmap?'
const BADLOC_MSG = 'Bad Location specified, expected format \'47.04 -122.86\'';

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

function getMap(params) {
    console.debug('Map Params: ', params);
    if(!(params[1] && params[2])) return BADLOC_MSG;

    // See: https://developers.google.com/maps/documentation/maps-static/start
    const mapParameters = {
        center: `${params[1]},${params[2]}` || '',
        zoom: params[3] || '15',  // Default to 15, street/building level.
        size: params[4] || '500x500',
        scale: '', // TODO: Implement scale optional parameter.
        format: '', // TODO: Implement format optional  parameter.
        maptype: 'hybrid',  // Hardcoding to Hybrid for the time being
    }

    console.debug('Parsed Params: ', mapParameters);

    // Construct our url
    // Start with our base url.
    let mapUrl = MAP_BASE;

    // Center is required (its where we're focusing)
    mapUrl += `center=${mapParameters.center}`;

    // Maptype is optional but defaults to roads only, we want hybrid for now.
    mapUrl += `&maptype=${mapParameters.maptype}`;

    // Zoom is optional, but the api is worthless if you dont set it.
    mapUrl += `&zoom=${mapParameters.zoom}`;

    // Size is a required parameter.
    mapUrl += `&size=${mapParameters.size}`;

    // Attach our API Key
    mapUrl += `&key=${MAP_API_KEY}`;

    // Return our url.
    return mapUrl;
}

function getMapHelp() {
    const EXAMPLE_TEXT = '```!getmap 36.01611081769955, -114.73728899363789 18 200x200```\n' +
        '**Example Key: **!getmap {lat} {lon} {zoom} {size}\n\n' +
        'Only Lat and Lon are required, commas may be omitted.\n ' +
        'Zoom Level (default: 15) and Image Size (default 500x500) are Optional.';
    return EXAMPLE_TEXT;
}

function handleMessage(msg) {
    if(msg.content.startsWith(MAP_TRIGGER)) {
        const params = msg.content.replace(',', '').split(' ');

        if(params.length < 3 || params[1] === MAP_HELP_TRIGGER) {
            msg.channel.send(getMapHelp());
        }  else {
            const map = getMap(params);
            console.debug('Returning Map Url: ', map);
            msg.channel.send(map);
        }
    }
}

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`) );
client.on('messageCreate', async msg => handleMessage(msg));

client.login(CLIENT_TOKEN);