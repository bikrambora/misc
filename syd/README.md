# Amazon Lex Demo

## Getting Started

### Select Amazon Lex
> You will find it in the Services dropdown of the AWS console

![amazon lex][amazon_lex_image]

### Create a new bot
![create bot][create_bot_image]

### Create a 'Custom bot'
> Enter values as you see them in the picture

![custom bot][custom_bot_image]

## Configuring the bot

### Creating Intents
> You can think of intents as actions the user wants to perform

![create intent][create_intent_image]

![name intent][name_intent_image]

### Creating Utterances
> These are the spoken or typed phrases that will invoke our intent

![add utterance][add_utterance_image]

### Set initialization and validation function

![lambda validation][lambda_validation_image]

### Create a Slot type
> You will create a custom slot for your bot and add it to your previously created Intent

![create slot][create_slot_image]
![add slot][add_slot_image]

### Adding slots
> Slots are parameters required to fulfill the intent
> Make sure they are all marked as required!

![add slots][add_slots_image]

### Set Fulfillment function

![fulfillment action][fulfillment_action_image]

## Running the bot

### Build bot
![build bot][build_bot_image]

### Expand bot panel
![expand panel][expand_panel_image]

## Interact with the bot

### Sample conversation
![conversation][conversation_image]

## Clean up

### Running clean up Lambda function
> Click Run with the following sample payload

```javascript
{
  "bot": "BookFlight",
  "intent": "BookPlaneTicket",
  "slot": "FlightClass"
}
```

![cleanup][cleanup_image]


[amazon_lex_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/amazon_lex.png
[create_bot_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/create_bot.png
[custom_bot_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/custom_bot.png
[create_intent_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/create_intent.png
[name_intent_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/name_intent.png
[add_utterance_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/add_utterances.png
[lambda_validation_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/lambda_validation.png
[create_slot_image]: .https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/create_slot.png
[add_slot_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/add_slot.png
[add_slots_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/add_slots.png
[fulfillment_action_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/fulfillment_action.png
[build_bot_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/build_bot.png
[expand_panel_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/expand_panel.png
[conversation_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/conversation.png
[cleanup_image]: https://s3.amazonaws.com/demo.aws-sa.com/markdown/images/cleanup.png