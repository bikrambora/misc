const AWS = require('aws-sdk');

const lex = new AWS.LexModelBuildingService();

const deleteBot = name => lex.deleteBot({ name }).promise();

const deleteIntent = name => lex.deleteIntent({ name }).promise();

const deleteSlotType = name => lex.deleteSlotType({ name }).promise();

const delay = (t, v) => new Promise(res => setTimeout(res.bind(null, v), t));

exports.handler = (event, context, callback) => {
    deleteBot(event.bot)
        .then(() => delay(5000))
        .then(() => deleteIntent(event.intent))
        .then(() => delay(5000))
        .then(() => deleteSlotType(event.slot))
        .then(() => callback(null, 'Demo cleanup successful'))
        .catch(err => callback(err, 'Error deleting demo'));
};