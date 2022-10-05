import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTaskContext } from '@twilio/flex-ui';
import DirectoryItem from './DirectoryItem/DirectoryItem';
import {
  TabContainer,
  ItemContainer,
} from './CustomDirectoryComponents';

class CustomDirectory extends React.Component {
  
  onTransferClick = (targetSid) => {
    const taskSid = this.props.task.sid;
    console.log('Transfer task', taskSid, ' to: ', targetSid);
      Actions.invokeAction('TransferTask', {sid: taskSid, targetSid});
      Actions.invokeAction('HideDirectory');
  }


  render() {
    return (
      <TabContainer key="custom-directory-container">
        <ItemContainer
          key="custom-directory-item-container"
          className="Twilio-WorkerDirectory-Queue"
          vertical
        >
          {this.props.workflows.map((item) => {
            if (item.friendlyName.includes("Transfer"))  {
            return (
              <DirectoryItem
                label={item.friendlyName}
                key={item.sid}
                workflowSid={item.sid}
                onTransferClick={this.onTransferClick}
              />
            );
          }
          })}

        </ItemContainer>
      </TabContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  workflows: state['transfers'].workflows.workflows || [],
});

export default connect(mapStateToProps)(withTaskContext(CustomDirectory));
