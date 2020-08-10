import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import Config from '../../helpers/Config';
import RoutesForClient from '../../helpers/RoutesForClient';
import APIRoutes from '../../helpers/APIRoutesForClient';
import UpdatesRenderer from '../_Custom/UpdatesRenderer';

export default class PasswordReset extends Component {

	constructor(props) {
		super(props);

		this.URChildRef = React.createRef();

		this.state = {
			token: undefined,
			password: "",
			inputDisabled: true,
			inputHidden: true,
			showErrors: false,
			errors: {},
			result: "",
			hideAllErrorsTimeout: () => { }
		};
		this.hideAllErrorsTimeoutFunc = this.hideAllErrorsTimeoutFunc.bind(this);
		this.onClick_hideInputErrorFunc = this.onClick_hideInputErrorFunc.bind(this);
		this.onChange_Password = this.onChange_Password.bind(this);
		this.onClick_Submit = this.onClick_Submit.bind(this);
	}

	componentDidMount() {
		// Code to run when component is loaded
		const { token } = this.props.match.params;
		this.setState({
			token: token
		}, () => { this.callServer() });
	}

	hideAllErrorsTimeoutFunc() {
		this.setState({
			hideAllErrorsTimeout: setTimeout(() => {
				this.setState({ showErrors: false });
				clearTimeout(this.state.hideAllErrorsTimeout);
			}, 5000)
		});
	}

	onClick_hideInputErrorFunc(e) {
		var new_errors = this.state.errors;
		new_errors[e.target.getAttribute('for')] = undefined;
		this.setState({
			errors: new_errors
		});
	}

	onChange_Password(e) {
		this.setState({
			password: e.target.value
		});
	}

	callServer(updatePassword = false) {
		const user = {
			password: undefined
		}

		if (updatePassword) {
			user.password = this.state.password;
		}

		axios.post(`${APIRoutes.PasswordReset}/${this.state.token}`, user, { withCredentials: true })
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
					}  else if (err.response.data.status === 401.3) {
						// Link is not valid for password reset
						this.updatesRenderer_ResetError_6();
					} else {
						//console.log(err.response.data)
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
		this.URChildRef.current.addUpdates({ updateStr: "Password Reset:" });
		this.URChildRef.current.addUpdates({
			updateStr: "Success",
			onNextLine: false,
			responseClass: "success",
			marginLeft: 2
		});
		this.URChildRef.current.addUpdates({ updateStr: "Try login with new password" });
		this.URChildRef.current.addUpdates({
			updateStr: `<a target='_blank' href='${process.env.PUBLIC_URL}${(Config.isHashRoute) ? '/#' : ''}${RoutesForClient.Login}'>Login Here</a>`,
			onNextLine: true,
			nextLineShowPrompt: false,
			responseClass: "important",
			marginLeft: 2
		});
	}

	updatesRenderer_ResetError() {
		this.URChildRef.current.addUpdates({ updateStr: "Password Reset:" });
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
		// Link is not valid for password reset
		this.updatesRenderer_ResetError();
		this.URChildRef.current.addUpdates({ updateStr: "Link is not valid for password reset" });
	}

	onClick_Submit(e) {
		e.preventDefault();

		clearTimeout(this.state.hideAllErrorsTimeout);

		// Clearing UpdatesRenderer console
		this.URChildRef.current.addUpdates({ undefined });

		this.setState({
			//inputDisabled: true,
			showErrors: false,
		});

		this.callServer(true);

	}

	render() {
		return (
			<div className="container formContainer">
				<form onSubmit={this.onClick_Submit}>
					<div className="form-group">
						<h3>Reset Password</h3>
					</div>
					<div className="form-group text-left">
						<label
							disabled={this.state.inputDisabled}
							hidden={this.state.inputHidden}
						>
							New Password
						</label>
						<input type="password"
							required
							className="form-control tb"
							value={this.state.username}
							onChange={this.onChange_Password}
							disabled={this.state.inputDisabled}
							hidden={this.state.inputHidden}
						/>
						<div htmlFor='password' className={`text-danger inputError ${
							(this.state.showErrors && this.state.errors.password) ? "show" : "hide"}`}
							onClick={this.onClick_hideInputErrorFunc}>
							{
								this.state.errors.password
									? this.state.errors.password.message
									: ""
							}
						</div>
					</div>
					<div className="form-group">
						<Button type="submit"
							outline
							color="secondary"
							disabled={this.state.inputDisabled}
							hidden={this.state.inputHidden}
						>
							clickity-clickity-click
						</Button>
					</div>
					<UpdatesRenderer ref={this.URChildRef} />
				</form>
			</div>
		);
	};
}
