import { Manager } from '@twilio/flex-ui';
const manager = Manager.getInstance();
const PLUGIN_NAME = 'WorkflowTransferPlugin';

class TaskRouterUtil {

  getWorkflows = async () => {
    console.debug('Getting all WorkFlows');
    const fetchUrl = `${process.env.FLEX_APP_FUNCTIONS_BASE}/get-workflows`;
    const fetchBody = {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
    };
    const fetchOptions = {
      method: 'POST',
      body: new URLSearchParams(fetchBody),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    };

    let workflows = [];
    try {
      const response = await fetch(fetchUrl, fetchOptions);
      workflows = await response.json();
      console.debug(PLUGIN_NAME, 'Workflows:', workflows);
    } catch (error) {
      console.error(PLUGIN_NAME, 'Failed to get Workflows');
    }
    
    return workflows;
  }

}

const trUtil = new TaskRouterUtil();

export default trUtil;