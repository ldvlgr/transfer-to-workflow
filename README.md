<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>

# Chat and SMS Transfers for Flex

The Chat and SMS Transfers for Flex plugin helps contact center administrators set up transferring of Chats and SMS between Agents.

**As of the writing of this document, Flex does not natively support transferring of non-voice tasks. To track the addition of Chat and SMS transfers as a feature, visit the [Flex Release Notes](https://www.twilio.com/docs/flex/release-notes) page.**

**Note if you have deployed this plugin between March 26 and August 11, 2020:** We recently made a fix that cleans up the channels of your agents when they perform a chat or SMS transfer. This will ensure that your agents don’t hit the limit of the channels they can join. We recommend installing the latest version of the plugin in order to get this change. See [Plugin Deployment instructions](#) to redeploy the plugin and [GitHub Issue #21](https://github.com/twilio-professional-services/plugin-chat-sms-transfer/issues/21) for more details on the bug.

---

## Set up

### Requirements

To deploy this plugin, you will need:

- An active Twilio account with Flex provisioned. Refer to the [Flex Quickstart](https://www.twilio.com/docs/flex/quickstart/flex-basics#sign-up-for-or-sign-in-to-twilio-and-create-a-new-flex-project") to create one.
- npm version 5.0.0 or later installed (type `npm -v` in your terminal to check)
- Node.js version 10.12.0 or later installed (type `node -v` in your terminal to check)
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli) along with the [Flex CLI Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins) and the [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins). Run the following commands to install them:
  ```
  # Install the Twilio CLI
  npm install twilio-cli -g
  # Install the Serverless and Flex as Plugins
  twilio plugins:install @twilio-labs/plugin-serverless
  twilio plugins:install @twilio-labs/plugin-flex
  ```

### Contributing

All contributions and improvements to this plugin are welcome! 

### Twilio Account Settings

Before we begin, we need to collect
all the config values we need to run this Flex plugin:

| Config&nbsp;Value | Description                                                                                                                                            |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workspace SID     | Your Flex Task Assignment workspace SID - find this [in the Console TaskRouter Workspaces page](https://www.twilio.com/console/taskrouter/workspaces). |
| Queue SID(s)      | The unique IDs of the Flex task queues you wish to use for chat or SMS transfers - find this in the Console TaskRouter TaskQueues page.                |

## Plugin Details

The Chat and SMS Transfers for Flex plugin adds a **Transfer** button near the **End Chat** button that comes out of the box with Flex. Clicking this button opens up the default [WorkerDirectory Flex component](https://www.twilio.com/docs/flex/ui/components#workerdirectory) with Agents and Queues tabs. Upon selecting an agent or a queue, this plugin will initiate a transfer of the chat task to the specified worker (agent) or queue.

![Chat Transfer UI]()

Because Flex does not natively support chat and SMS transfers, this plugin works by creating a new task and routing it through your workflow as normal. Subsequent "transfer" tasks are linked to the original task to be compatible with Flex Insights reporting.

It is up to you to implement the necessary TaskRouter routing rules to send the task to the specified queue or worker. To aid you in this, three new attributes within [`functions/transfer-chat.js`](functions/functions/transfer-chat.js) will be added to your tasks: `targetSid`, `transferTargetType`, and `ignoreAgent`:

| Attribute            | Expected Setting                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `targetSid`          | Worker, Workflow or Queue Sid which will be used to determine if you are transferring to a worker, workflow or a queue.                                                                                                                                                                                                                                                                  |
| `transferTargetType` | Can be set to `worker`, `workflow` or `queue` and lets your workflow route the task to a specific agent or queue. If you are routing the task to a specific worker, we recommend you have a queue like the "Everyone" queue where all workers are members of the queue. Additionally, set the `targetSid` to the Sid of the worker you want to transfer the chat or SMS task to. |
| `ignoreAgent`        | This will be populated by the name of the agent who initiated the chat/SMS transfer. This ensures that the last agent to transfer the task will not receive the transfer they initiated, _assuming they are transferring the Task to a queue they are already a member of._                                                                                          |

---



# Configuration

## Requirements

To deploy this plugin, you will need:

- An active Twilio account with Flex provisioned. Refer to the [Flex Quickstart](https://www.twilio.com/docs/flex/quickstart/flex-basics#sign-up-for-or-sign-in-to-twilio-and-create-a-new-flex-project%22) to create one.
- npm version 5.0.0 or later installed (type `npm -v` in your terminal to check)
- Node.js version 12 or later installed (type `node -v` in your terminal to check). We recommend the _even_ versions of Node.
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli) along with the [Flex CLI Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins) and the [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins). Run the following commands to install them:

```
# Install the Twilio CLI
npm install twilio-cli -g
# Install the Serverless and Flex as Plugins
twilio plugins:install @twilio-labs/plugin-serverless
twilio plugins:install @twilio-labs/plugin-flex
```

## Setup

Install the dependencies by running `npm install`:

```bash
cd plugin-...TBD
npm install
cd ../chat-functions
npm install
```
From the root directory, rename `public/appConfig.example.js` to `public/appConfig.js`.

```bash
mv public/appConfig.example.js public/appConfig.js
```

## Serverless Functions
You need to deploy the function associated with the Chat and SMS Transfers plugin to your Flex instance. The function is called from the plugin you will deploy in the next step and integrates with TaskRouter, passing in required attributes to perform the chat transfer.

### Deployment

Create the Serverless config file by copying `.env.example` to `.env`.

```bash
cd chat-functions
cp .env.example .env
```
Edit `.env` and set the `TWILIO_WORKSPACE_SID` variable to your Twilio TaskRouter Workspace Sid. Set `TWILIO_CHAT_TRANSFER_WORKFLOW_SID` to the transfer workflow Sid.  

TWILIO_WORKSPACE_SID = WSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

TWILIO_CHAT_TRANSFER_WORKFLOW_SID = WWXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


Next, deploy the Serverless functions:
```bash
cd chat-functions
twilio serverless:deploy
```
After successfully deploying your function, you should see at least the following:
```bash
Deploying functions & assets to the Twilio Runtime

✔ Serverless project successfully deployed

Deployment Details
Domain: chat-transfer-functions-xxxx-dev.twil.io
Service:
   chat-transfer-functions (ZS8xxxx)

Runtime:
   node14

Functions:
   https://chat-transfer-functions-xxxx-dev.twil.io/get-workflows
   https://chat-transfer-functions-xxxx-dev.twil.io/transfer-chat

```

Your functions will now be present in the Twilio Functions Console and be part of the "chat-functions" service. Copy the base URL from the function.

## Flex Plugin

### Development

Create the plugin config file by copying `.env.example` to `.env`.

```bash
cd plugin-...
cp .env.example .env
```

Edit `.env` and set the `FLEX_APP_FUNCTIONS_BASE` variable to your Twilio Functions base URL (like https://chat-transfer-functions-xxxx-dev.twil.io). 

To run the plugin locally, you can use the Twilio Flex CLI plugin. Using your command line, run the following from the root directory of the plugin.

```bash
cd plugin-...
twilio flex:plugins:start
```

This will automatically start up the webpack dev server and open the browser for you. Your app will run on `http://localhost:3000`.

When you make changes to your code, the browser window will be automatically refreshed.


### Deploy your Flex Plugin

Once you are happy with your Flex plugin, you have to deploy then release it on your Flex application.

Run the following command to start the deployment:

```bash
twilio flex:plugins:deploy --major --changelog "Releasing Chat Transfer plugin" --description "Chat Transfer plugin"
```

After running the suggested next step, navigate to the [Plugins Dashboard](https://flex.twilio.com/admin/) to review your recently deployed plugin and confirm that it’s enabled for your contact center.

**Note:** Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.

You are all set to test this plugin on your Flex application!




---

## Changelog


### 2.2.0

**July 2022**

-Adding Transfer to Workflow functionality

### 2.0.0

**November 18, 2020**

- Updated plugin to use the latest Flex plugin for the Twilio CLI. 
- Updated prerequisites and deployment instructions in the README. For more details, see [Keeping Plugins Up-to-Date](https://www.twilio.com/docs/flex/developer/plugins/updating).

### 1.3.1

**September 25, 2020**

- Added full test suite and github actions. Updated readme with instructions on how to run tests.

### 2.0.0

**September 25, 2020**

- Added error handling that rejoins the original agent to the chat session should an error occur during the transfer request.

### 1.2.0

**September 4, 2020**

- We now fully bypass the Flex ChatOrchestrator object and manually remove agent's from chat sessions. This ensures agents don't hit the 250 Chat Channel limit while transfering chat sessions.

### 1.1.0

**August 20, 2020**

- Twilio Channel Janitor will no longer clean up chat channels as soon as they are transferred. Now you can operate this plugin even if you have the Janitor service enabled on your Flex Flow.
- Unfortunately, we can't make warm transfers work with this new update, so all transfers are now "cold" (meaning the initiating agent will have their task immediately completed).
- We had previously been hardcoding `http://` protocol in the `fetch` call to the associated Twilio function. This has been removed and your `SERVERLESS_FUNCTION_DOMAIN` should now specify your desired protocol. This makes transitioning from local development to production a little easier.

### 1.0.1

**August 13, 2020**

- Updated README - added changelog

### 1.0.0

**August 11, 2020**

- Fixes [GitHub Issue #21](https://github.com/twilio-professional-services/plugin-chat-sms-transfer/issues/21)


## Disclaimer
This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.

## License

[MIT](http://www.opensource.org/licenses/mit-license.html)
