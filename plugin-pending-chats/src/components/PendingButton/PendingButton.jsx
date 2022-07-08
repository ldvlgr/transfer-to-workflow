import React from 'react';
import { Manager, Actions, withTheme, withTaskContext } from '@twilio/flex-ui';
import { StyledButton } from './PendingButton.Styles';
let manager = Manager.getInstance();
const PLUGIN_NAME = 'PendingChatsPlugin';

class PendingButton extends React.PureComponent {

	onClickHandler = async () => {
		console.log('Change Chat to long lived', this.props.task);
		
		let channelSid = this.props.task.attributes.channelSid;
		manager.chatClient.getChannelBySid(channelSid)
			.then(async (channel) => {
				let channelAttributes = await channel.getAttributes();
				console.log(PLUGIN_NAME, 'Channel Attributes:', channelAttributes);
				
				const newChanAttr = {...channelAttributes, long_lived:true};
				console.log(PLUGIN_NAME, 'Updated Channel Attributes:', newChanAttr);
				await channel.updateAttributes(newChanAttr);
				console.log(PLUGIN_NAME, 'Wrapping Task/Reservation', this.props.task);
				await this.props.task.wrapUp();

			});

	}

	render() {
		return (
			<StyledButton
				color={this.props.theme.colors.base11}
				background={this.props.theme.colors.base2}
				onClick={() => this.onClickHandler()}
			>
				Pending
			</StyledButton>
		);
	}
}

export default withTheme(withTaskContext(PendingButton));
