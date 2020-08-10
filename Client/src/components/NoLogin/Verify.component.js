import React, { Component } from 'react';
import axios from 'axios';
import Config from '../../helpers/Config';
import RoutesForClient from '../../helpers/RoutesForClient';
import APIRoutes from '../../helpers/APIRoutesForClient';
import UpdatesRenderer from '../_Custom/UpdatesRenderer';

export default class Verify extends Component {

	constructor(props) {
		super(props);

		this.URChildRef = React.createRef();

		this.state = {
			token: undefined,
			result: "",
		};
	}

	componentDidMount() {
		// Code to run when component is loaded
		const { token } = this.props.match.params;
		this.setState({
			token: token
		}, () => { this.callServer() });
	}

	callServer() {
		axios.post(`${APIRoutes.Verify}/${this.state.token}`, undefined, { withCredentials: true })
			.then(res => {
				if (res.status === 202) {
					// Password Reset Link is Valid
					this.setState({
						inputDisabled: false,
						inputHidden: false
					});
				} else if (res.status === 200) {
					// Password Updated
					this.setState({
						inputDisabled: true,
						inputHidden: true,
					});
					this.updatesRenderer_ResetSuccess();
				}
			}).catch(err => {
				//checking for error for mobile device
				if (err.response) {
					//no mobile device errors
					if (err.response.status === 500 || err.response.data.status === 500) {
						// Internal server error
						//console.log(err.response.data)
						this.updatesRenderer_ResetError_1();
					} else if (err.response.data.status === 408.1) {
						// Verification code not available
						this.updatesRenderer_ResetError_2();
					} else if (err.response.data.status === 408.2) {
						// Link expired or is invalid
						this.updatesRenderer_ResetError_3();
					} else if (err.response.data.status === 401.1) {
						// User does not exist anymore
						this.updatesRenderer_ResetError_4();
					} else if (err.response.data.status === 401.2) {
						// Link has already been used
						this.updatesRenderer_ResetError_5();
					} else if (err.response.data.status === 401.3) {
						// Link is not valid for verification
						this.updatesRenderer_ResetError_6();
					} else {
						this.setState({
							inputDisabled: false,
							showErrors: true,
							errors: err.response.data
						});
						this.hideAllErrorsTimeoutFunc();
					}
				} else {
					//showing error for mobile device
					this.setState({
						result: JSON.stringify(err, null, 2)
					});
				}
			});
	}

	updatesRenderer_ResetSuccess(ExpiresInHours) {
		this.URChildRef.current.addUpdates({ updateStr: "Email Verification:" });
		this.URChildRef.current.addUpdates({
			updateStr: "Success",
			onNextLine: false,
			responseClass: "success",
			marginLeft: 2
		});
		this.URChildRef.current.addUpdates({ updateStr: "You can login now" });
		this.URChildRef.current.addUpdates({
			updateStr: `<a target='_blank' href='${process.env.PUBLIC_URL}${(Config.isHashRoute) ? '/#' : ''}${RoutesForClient.Login}'>Login Here</a>`,
			onNextLine: true,
			nextLineShowPrompt: false,
			responseClass: "important",
			marginLeft: 2
		});
	}

	updatesRenderer_ResetError() {
		this.URChildRef.current.addUpdates({ updateStr: "Email Verification:" });
		this.URChildRef.current.addUpdates({
			updateStr: "Failure",
			onNextLine: false,
			responseClass: "error",
			marginLeft: 2
		});
	}

	updatesRenderer_ResetError_1() {
		// Internal server error
		this.updatesRenderer_ResetError();
		this.URChildRef.current.addUpdates({ updateStr: "Contact administrator" });
		this.URChildRef.current.addUpdates({
			updateStr: "TH3-AZ",
			nextLineShowPrompt: false,
			responseClass: "important",
			marginLeft: 2
		});
	}

	updatesRenderer_ResetError_2() {
		// Verification code not available
		this.updatesRenderer_ResetError();
		this.URChildRef.current.addUpdates({ updateStr: "Code not available in link" });
	}

	updatesRenderer_ResetError_3() {
		// Link expired or is invalid
		this.updatesRenderer_ResetError();
		this.URChildRef.current.addUpdates({ updateStr: "Link expired or is invalid" });
	}

	updatesRenderer_ResetError_4() {
		// User does not exist anymore
		this.updatesRenderer_ResetError();
		this.URChildRef.current.addUpdates({ updateStr: "User doesn't exist anymore" });
	}

	updatesRenderer_ResetError_5() {
		// Link has already been used
		this.updatesRenderer_ResetError();
		this.URChildRef.current.addUpdates({ updateStr: "Link has already been used" });
	}

	updatesRenderer_ResetError_6() {
		// Link is not valid for verification
		this.updatesRenderer_ResetError();
		this.URChildRef.current.addUpdates({ updateStr: "Link is not valid for verification" });
	}

	render() {
		return (
			<div className="container formContainer">
				<form onSubmit={this.onClick_Submit}>
					<div className="form-group">
						<h3>Account Verification</h3>
					</div>
					<UpdatesRenderer ref={this.URChildRef} />
				</form>
			</div>
		);
	};
}
