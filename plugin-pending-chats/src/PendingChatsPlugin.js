import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import TransferButton from './components/TransferButton/TransferButton';
import PendingButton from './components/PendingButton/PendingButton';

import reducers, { namespace } from './states';

import { setUpActions } from './helpers/actions';
import { setUpNotifications } from './helpers/notifications';
import CustomDirectory from './components/CustomDirectory/CustomDirectory';
import TaskRouterUtil from './helpers/TaskRouterUtil';
import { Actions as WorkflowActions } from './states/WorkflowState';
const PLUGIN_NAME = 'PendingChatsPlugin';

export default class PendingChatsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);
    setUpNotifications();
    setUpActions();

    //Save workerName in the Chat Channel attributes for known agent routing on next convo
    manager.workerClient.on("reservationCreated", async reservation => {
      if (reservation.task.taskChannelUniqueName == 'chat') {
        let channelSid = reservation.task.attributes.channelSid;
        manager.chatClient.getChannelBySid(channelSid)
          .then(async (channel) => {
            let channelAttributes = await channel.getAttributes();
            console.log(PLUGIN_NAME, 'Channel Attributes:', channelAttributes);
            let workerName = manager.workerClient.name; 
            const newChanAttr = {...channelAttributes, workerName};
            console.log(PLUGIN_NAME, 'Updated Channel Attributes:', newChanAttr);
            await channel.updateAttributes(newChanAttr);

          });
        }
      });



    const options = { sortOrder: -1 };
    
    flex.TaskCanvasHeader.Content.add(<PendingButton key="chat-pending-button" />, {
      sortOrder: 1,
      if: (props) =>
        props.channelDefinition.capabilities.has('Chat') && props.task.taskStatus === 'assigned',
    });

    flex.TaskCanvasHeader.Content.add(<TransferButton key="chat-transfer-button" />, {
      sortOrder: 1,
      if: (props) =>
        props.channelDefinition.capabilities.has('Chat') && props.task.taskStatus === 'assigned',
    });

    // Remove Queues tab
    //flex.WorkerDirectory.Tabs.Content.remove('queues');
    // Add new Queues tab
    flex.WorkerDirectory.Tabs.Content.add(
      <flex.Tab key="custom-directory" label="Destinations">
        <CustomDirectory
        />
      </flex.Tab>
    );

    let workflows = await TaskRouterUtil.getWorkflows();
    console.log(PLUGIN_NAME, 'Workflows: ', workflows);
    manager.store.dispatch(WorkflowActions.setWorkflows(workflows));
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
