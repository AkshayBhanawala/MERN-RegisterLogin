import React from 'react';
import PropTypes from "prop-types";
import './UpdateRenderer.css';

class UpdatesRenderer extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			updates: '',
		};
	}
	componentDidUpdate(prevProps) {
		if (
			prevProps.update !== this.props.update ||
			prevProps.onNextLine !== this.props.onNextLine ||
			prevProps.showPrompt !== this.props.showPrompt ||
			prevProps.responseClass !== this.props.responseClass ||
			prevProps.marginLeft !== this.props.marginLeft) {
			this.addUpdates(
				this.props.update,
				this.props.onNextLine,
				this.props.showPrompt,
				this.props.responseClass,
				this.props.marginLeft
			);
		}
	}

	componentDidMount() {
		// Code to run when component is loaded
		global.updates = {
			i: 0,
			running: false,
			finalValue: "",
			initialized: false
		}
	}

	addUpdates = ({
		updateStr = undefined,
		onNextLine = true,
		nextLineShowPrompt = true,
		responseClass = "",
		marginLeft = 0
	}) => {
		if (!updateStr || updateStr === "") {
			global.updates = {
				i: 0,
				running: false,
				finalValue: "",
				initialized: false
			};
			this.setState({
				updates: ""
			});
			return;
		}
		const promptClass = (onNextLine && nextLineShowPrompt) ? "prompt" : "";
		const spanClass = "console";
		if (!global.updates.initialized) {
			global.updates.finalValue = `<span class='${spanClass} ${responseClass} ${promptClass} ml-${marginLeft}'>${updateStr}`;
			global.updates.initialized = true;
		} else if (onNextLine) {
			global.updates.finalValue += `</span><br><span class='${spanClass} ${responseClass} ${promptClass} ml-${marginLeft}'>${updateStr}`;
		} else {
			global.updates.finalValue += `</span><span class='${spanClass} ${responseClass} ml-${marginLeft}'>${updateStr}`;
		}
		if (!global.updates.running) {
			var i = global.updates.i;
			global.updates.running = true;
			var myInterval = setInterval(() => {
				var chArray = [...global.updates.finalValue];
				if (i < chArray.length) {
					if (chArray[i] === "<") {
						var str = "";
						while (chArray[i] !== ">") {
							str += chArray[i++];
						}
						this.setState({
							updates: this.state.updates + str
						});
					} else {
						this.setState({
							updates: this.state.updates + chArray[i++]
						});
					}
				} else {
					global.updates.running = false;
					global.updates.i = i;
					clearInterval(myInterval);
				}
			}, 50);
		}
	};

	render() {
		return (
			<div className="updates" dangerouslySetInnerHTML={{ __html: this.state.updates }}>
			</div>
		)
	}
}

UpdatesRenderer.propTypes = {
	update: PropTypes.string,
	onNextLine: PropTypes.bool,
	showPrompt: PropTypes.bool,
	responseClass: PropTypes.string,
	marginLeft: PropTypes.number,
};

export default UpdatesRenderer;