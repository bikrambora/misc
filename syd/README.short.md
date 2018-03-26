# Amazon Lex Demo

## Getting Started

### Select Amazon Lex
> You will find it in the services dropdown of the AWS console

### Create a new bot
> Click the 'Create' button

### Create a 'Custom bot'
> Enter values as follow, leave the rest as default and click 'Create'

* Bot name: BookFlight
* Output Voice: None. This is only a text based application
* Session Timeout: 5 min
* COPPA: No

## Configuring the bot

### Creating Intents
```You can think of intents as actions the user wants to perform```

> Click the 'Create Intent' button

> Select 'Create intent'

> Give it the unique name of BookPlaneTicket

### Creating Utterances
```These are the spoken or typed phrases that will invoke our intent```

> Add the following 3 utterances in the 'Sample utterances' section

* I would like to book a flight
* I need a plane ticket
* Help me booking a flight

### Set initialization and validation function
> Select the right lambda function and alias as follows

* Lambda function: lex-bookflight
* Version or Alias: DEMO

### Create a Slot type
> Select the plus icon next to 'Slot types'

> Select 'Create slot type'

> Enter the following values and click 'Add slot to intent'

* Slot type name: FlightClass
* Slot Resolution: Expand Values
* Value:
  * economy
  * premium economy
  * business

### Adding slots
```Slots are parameters required to fulfill the intent```
> Enter them as follows

|Priority|Required|Name|Slot Type|Prompt|
|:------:|:------:|:--:|:-------:|:----:|
|1| [X]|FromCountry|AMAZON.Country|Country of departure?|
|2| [X]|ToCountry|AMAZON.Country|Country of arrival?|
|3| [X]|When|AMAZON.DATE|Date of departure?|
|4| [X]|FlightClass|FlightClass|Class of ticket?|

### Set Fulfillment function

> Select the right lambda function and alias as follows

* Lambda function: lex-bookflight
* Version or Alias: DEMO

## Running the bot

### Build bot
> Click 'Build' in the upper right corner

### Expand bot panel
> Click 'Test Chatbot' on the right hand side of the screen

## Interact with the bot

### Sample conversation

* Initiate: Type 'I need a plane ticket'
* Departure: Type your favorite country (i.e Australia)
* Arrival: Type your favorite holiday destination (i.e Japan)
* Date: Type a date (i.e Saturday, 2018-05-22 or June 6th)
* Class: Type one of the slot types you created (economy/premium economy/business)

## Clean up
> Go to the 'Cloud9' service and click 'Open IDE' for the Summit-Lex environment

### Running clean up Lambda function
> Click 'Run' with the following sample payload

```javascript
{
  "bot": "BookFlight",
  "intent": "BookPlaneTicket",
  "slot": "FlightClass"
}
```