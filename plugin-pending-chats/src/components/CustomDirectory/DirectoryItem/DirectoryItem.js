import * as React from 'react';
import { IconButton, UserCard, withTheme } from '@twilio/flex-ui';
import {
  ButtonContainer,
  ItemInnerContainer,
} from '../CustomDirectoryComponents';
import { WorkerMarginPlaceholder } from './DirectoryItemComponents';

class DirectoryItem extends React.Component {
  
  render() {
    return (
      <ItemInnerContainer
        className="Twilio-WorkerDirectory-QueueAvatar"
        noGrow
        noShrink
      >
        <WorkerMarginPlaceholder noGrow noShrink />
        <UserCard
          className="Twilio-Icon Twilio-Icon-Queue"
          firstLine={this.props.label}
          large
        />
        <ButtonContainer className="Twilio-WorkerDirectory-ButtonContainer">
          
          <IconButton
            icon="Transfer"
            onClick={() => this.props.onTransferClick(this.props.workflowSid)}
            themeOverride={this.props.theme.WorkerDirectory.ItemActionButton}
            title="Transfer to WorkFlow"
          />
        </ButtonContainer>
      </ItemInnerContainer>
    );
  }
}

export default withTheme(DirectoryItem);
