'use strict';

const classes = ['economy', 'premium economy', 'business'];
const countries = ["afghanistan", "åland islands", "albania", "algeria", "american samoa", "andorra", "angola", "anguilla", "antarctica", "antigua and barbuda", "argentina", 
"armenia", "aruba", "australia", "austria", "azerbaijan", "bahamas", "bahrain", "bangladesh", "barbados", "belarus", "belgium", "belize", "benin", "bermuda", "bhutan", 
"bolivia, plurinational state of", "bonaire, sint eustatius and saba", "bosnia and herzegovina", "botswana", "bouvet island", "brazil", "british indian ocean territory", 
"brunei darussalam", "bulgaria", "burkina faso", "burundi", "cambodia", "cameroon", "canada", "cape verde", "cayman islands", "central african republic", "chad", "chile", 
"china", "christmas island", "cocos (keeling) islands", "colombia", "comoros", "congo", "congo, the democratic republic of the", "cook islands", "costa rica", 
"côte d'ivoire", "croatia", "cuba", "curaçao", "cyprus", "czech republic", "denmark", "djibouti", "dominica", "dominican republic", "ecuador", "egypt", "el salvador", 
"equatorial guinea", "eritrea", "estonia", "ethiopia", "falkland islands (malvinas)", "faroe islands", "fiji", "finland", "france", "french guiana", "french polynesia", 
"french southern territories", "gabon", "gambia", "georgia", "germany", "ghana", "gibraltar", "greece", "greenland", "grenada", "guadeloupe", "guam", "guatemala", 
"guernsey", "guinea", "guinea-bissau", "guyana", "haiti", "heard island and mcdonald islands", "holy see (vatican city state)", "honduras", "hong kong", "hungary", 
"iceland", "india", "indonesia", "iran, islamic republic of", "iraq", "ireland", "isle of man", "israel", "italy", "jamaica", "japan", "jersey", "jordan", "kazakhstan", 
"kenya", "kiribati", "korea, democratic people's republic of", "korea, republic of", "kuwait", "kyrgyzstan", "lao people's democratic republic", "latvia", "lebanon", 
"lesotho", "liberia", "libya", "liechtenstein", "lithuania", "luxembourg", "macao", "macedonia, the former yugoslav republic of", "madagascar", "malawi", "malaysia", 
"maldives", "mali", "malta", "marshall islands", "martinique", "mauritania", "mauritius", "mayotte", "mexico", "micronesia, federated states of", "moldova, republic of", 
"monaco", "mongolia", "montenegro", "montserrat", "morocco", "mozambique", "myanmar", "namibia", "nauru", "nepal", "netherlands", "new caledonia", "new zealand", 
"nicaragua", "niger", "nigeria", "niue", "norfolk island", "northern mariana islands", "norway", "oman", "pakistan", "palau", "palestine, state of", "panama", 
"papua new guinea", "paraguay", "peru", "philippines", "pitcairn", "poland", "portugal", "puerto rico", "qatar", "réunion", "romania", "russian federation", "rwanda", 
"saint barthélemy", "saint helena, ascension and tristan da cunha", "saint kitts and nevis", "saint lucia", "saint martin (french part)", "saint pierre and miquelon", 
"saint vincent and the grenadines", "samoa", "san marino", "sao tome and principe", "saudi arabia", "senegal", "serbia", "seychelles", "sierra leone", "singapore", 
"sint maarten (dutch part)", "slovakia", "slovenia", "solomon islands", "somalia", "south africa", "south georgia and the south sandwich islands", "south sudan", "spain", 
"sri lanka", "sudan", "suriname", "svalbard and jan mayen", "swaziland", "sweden", "switzerland", "syrian arab republic", "taiwan, province of china", "tajikistan", 
"tanzania, united republic of", "thailand", "timor-leste", "togo", "tokelau", "tonga", "trinidad and tobago", "tunisia", "turkey", "turkmenistan", 
"turks and caicos islands", "tuvalu", "uganda", "ukraine", "united arab emirates", "united kingdom", "united states", "united states minor outlying islands", "uruguay", 
"uzbekistan", "vanuatu", "venezuela, bolivarian republic of", "viet nam", "virgin islands, british", "virgin islands, u.s.", "wallis and futuna", "western sahara", 
"yemen", "zambia", "zimbabwe"];

// --------------- Helpers that build all of the responses -----------------------

const elicitSlot = (intentName, slots, slotToElicit, message, sessionAttributes = {}) => ({
    sessionAttributes,
    dialogAction: {
        type: 'ElicitSlot',
        intentName,
        slots,
        slotToElicit,
        message
    }   
});

const close = (fulfillmentState, message, sessionAttributes = {}) => ({
    sessionAttributes,
    dialogAction: {
        type: 'Close',
        fulfillmentState,
        message,
    }    
});

const delegate = (slots, sessionAttributes = {}) => ({
    sessionAttributes,
    dialogAction: {
        type: 'Delegate',
        slots,
    }    
});

// ---------------- Helper Functions --------------------------------------------------

const parseLocalDate = date => {
    const dateComponents = date.split(/\-/);
    return new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2]);
}

const isValidCountry = country => (countries.indexOf(country.toLowerCase()) > -1);

const isValidClass = flightClass => (classes.indexOf(flightClass.toLowerCase()) > -1);

const isValidDate = date => {
    try {
        return !(isNaN(parseLocalDate(date).getTime()));
    } catch (err) {
        return false;
    }
}

const buildValidationResult = (isValid, violatedSlot, messageContent) => ({
    isValid,
    violatedSlot,
    message: { contentType: 'PlainText', content: messageContent }
});

const validateFlight = slots => {
    console.log(slots);
    const fromCountry = slots.FromCountry;
    const toCountry = slots.ToCountry;
    const when = slots.When;
    const flightClass = slots.FlightClass;

    if (fromCountry && !isValidCountry(fromCountry)) {
        return buildValidationResult(false, 'FromCountry', `We currently do not support ${fromCountry} as a valid departure.  Can you try a different country?`);
    }

    if (toCountry && !isValidCountry(toCountry)) {
        return buildValidationResult(false, 'ToCountry', `We currently do not support ${toCountry} as a valid destination.  Can you try a different country?`);
    }

    if (when) {
        if (!isValidDate(when)) {
            return buildValidationResult(false, 'When', 'I did not understand your departure date.  When would you like to depart?');
        } if (parseLocalDate(when) < new Date()) {
            return buildValidationResult(false, 'When', 'Reservations must be scheduled at least one day in advance.  Can you try a different date?');
        }
    }

    if (flightClass && !isValidClass(flightClass)) {
        return buildValidationResult(false, 'FlightClass', 'I did not understand your flight class. Pick one from economy, premium economy or business');
    }

    return { isValid: true };
}

const bookFlight = (intentRequest, callback) => {
    const FromCountry = intentRequest.currentIntent.slots.FromCountry;
    const ToCountry = intentRequest.currentIntent.slots.ToCountry;
    const When = intentRequest.currentIntent.slots.When;
    const FlightClass = intentRequest.currentIntent.slots.FlightClass;

    if (intentRequest.invocationSource === 'DialogCodeHook') {
        const validationResult = validateFlight(intentRequest.currentIntent.slots);
        if (validationResult.isValid) {
            return callback(delegate(intentRequest.currentIntent.slots));
        }
        
        const slots = intentRequest.currentIntent.slots;
        slots[`${validationResult.violatedSlot}`] = null;
        return callback(
            elicitSlot(intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message)
        );
    }

    console.log(`bookFlight under=${{ ReservationType: 'Flight', FromCountry, ToCountry, When, FlightClass }}`);

    callback(
        close('Fulfilled',
        { 
            contentType: 'PlainText', 
            content: `Thanks, I have placed your reservation. You will be flying ${FlightClass} class from ${FromCountry} to ${ToCountry} on ${When}.`
        })
    );
}

// --------------- Intents -----------------------

const dispatch = (intentRequest, callback) => {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);

    const intentName = intentRequest.currentIntent.name;

    if (intentName === 'BookPlaneTicket') {
        return bookFlight(intentRequest, callback);
    }
    throw new Error(`Intent with name ${intentName} not supported`);
}

// --------------- Main handler -----------------------

const loggingCallback = (response, originalCallback) => originalCallback(null, response);

exports.handler = (event, context, callback) => {
    try {
        process.env.TZ = 'Australia/Sydney';
        console.log(`event.bot.name=${event.bot.name}`);
        
        if (event.bot.name != 'BookFlight') {
             callback('Invalid Bot Name');
        }
        
        dispatch(event, (response) => loggingCallback(response, callback));
    } catch (err) {
        callback(err);
    }
};