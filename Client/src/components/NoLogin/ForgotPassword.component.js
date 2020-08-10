import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import Config from '../../helpers/Config';
import RoutesForClient from '../../helpers/RoutesForClient';
import APIRoutes from '../../helpers/APIRoutesForClient';
import UpdatesRenderer from '../_Custom/UpdatesRenderer';

export default class ForgotPassword extends Component {

	constructor(props) {
		super(props);

		this.URChildRef = React.createRef();

		this.state = {
			username: "",
			inputDisabled: false,
			showErrors: false,
			errors: {},
			result: "",
			hideAllErrorsTimeout: () => { }
		};
		this.hideAllErrorsTimeoutFunc = this.hideAllErrorsTimeoutFunc.bind(this);
		this.onClick_hideInputErrorFunc = this.onClick_hideInputErrorFunc.bind(this);
		this.onChange_Username = this.onChange_Username.bind(this);
		this.onClick_Submit = this.onClick_Submit.bind(this);
	}

	componentDidMount() {
		// Code to run when component is loaded

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

	onChange_Username(e) {
		this.setState({
			username: e.target.value
		});
	}

	updatesRenderer_ResetSuccess(ExpiresInHours) {
		this.URChildRef.current.addUpdates({
			updateStr: "Sent",
			onNextLine: false,
			responseClass: "success",
			marginLeft: 2
		});
		this.URChildRef.current.addUpdates({ updateStr: "Email Expires in:" });
		this.URChildRef.current.addUpdates({
			updateStr: `${ExpiresInHours} hour(s)`,
			onNextLine: false,
			responseClass: "important",
			marginLeft: 2
		});
		this.URChildRef.current.addUpdates({ updateStr: "Receiving time:" });
		this.URChildRef.current.addUpdates({
			updateStr: "10-20 minutes",
			onNextLine: false,
			responseClass: "important",
			marginLeft: 2
		});
	}

	updatesRenderer_ResetError() {
		this.URChildRef.current.addUpdates({
			updateStr: "Not Sent",
			onNextLine: false,
			responseClass: "error",
			marginLeft: 2
		});
		this.URChildRef.current.addUpdates({ updateStr: "Contact administrator" });
		this.URChildRef.current.addUpdates({
			updateStr: "TH3-AZ",
			nextLineShowPrompt: false,
			responseClass: "important",
			marginLeft: 2
		});
	}

	onClick_Submit(e) {
		e.preventDefault();

		clearTimeout(this.state.hideAllErrorsTimeout);

		this.URChildRef.current.addUpdates({ undefined });

		this.setState({
			result: "",
			inputDisabled: true,
			showErrors: false,
		});

		const DATA = {
			publicURLPart: `${process.env.PUBLIC_URL}${(Config.isHashRoute) ? '/#' : ''}${RoutesForClient.PasswordReset}`,
			user: {
				username: this.state.username
			},
		};
		this.URChildRef.current.addUpdates({ updateStr: "Reset Email:" });
		axios.post(APIRoutes.SendPasswordResetEmail, DATA, { withCredentials: true }).then(res => {
			this.updatesRenderer_ResetSuccess(res.data.passwordreset.ExpiresInHours);
		}).catch(err => {
			//console.log(err.response);
			//checking for error for mobile device
			if (err.response) {
				//no mobile device errors
				if (err.response.status === 500 || err.response.data.status === 500) {
					this.updatesRenderer_ResetError();
				} else {
					this.URChildRef.current.addUpdates({ undefined });
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

	render() {
		return (
			<div className="container formContainer">
				<form onSubmit={this.onClick_Submit}>
					<div className="form-group">
						<h3>Forgot Password</h3>
					</div>
					<div className="form-group text-left">
						<label style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
							<span>Username</span>
							<span>Email</span>
						</label>
						<input type="text"
							required
							className="form-control tb"
							value={this.state.username}
							onChange={this.onChange_Username}
							disabled={this.state.inputDisabled}
						/>
						<div htmlFor='username' className={`text-danger inputError ${
							(this.state.showErrors && this.state.errors.username) ? "show" : "hide"}`}
							onClick={this.onClick_hideInputErrorFunc}>
							{
								this.state.errors.username
									? this.state.errors.username.message
									: ""
							}
						</div>
					</div>
					<div className="form-group">
						<Button type="submit"
							outline
							color="secondary"
							disabled={this.state.inputDisabled}
						>clickity-clickity-click</Button>
					</div>
					<UpdatesRenderer ref={this.URChildRef} />
				</form>
			</div>
		);
	};
}
