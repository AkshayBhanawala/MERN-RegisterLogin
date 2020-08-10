import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointLeft, faHandPointRight } from '@fortawesome/free-regular-svg-icons';
import Emoji from 'a11y-react-emoji';
import axios from 'axios';
import Config from '../../helpers/Config';
import RoutesForClient from '../../helpers/RoutesForClient';
import APIRoutes from '../../helpers/APIRoutesForClient';
import UpdatesRenderer from '../_Custom/UpdatesRenderer';

export default class Login extends Component {
		_isMounted = true;

	constructor(props) {
		super(props);

		this.URChildRef = React.createRef();

		this.state = {
			isUser: false,
			isUserAdmin: false,
			username: "",
			password: "",
			inputDisabled: false,
			showErrors: false,
			errors: {},
			update: {
				value: "",
				addNextLine: false,
				responseClass: ""
			},
			hideAllErrorsTimeout: () => {}
		};
		this.hideAllErrorsTimeoutFunc = this.hideAllErrorsTimeoutFunc.bind(this);
		this.onClick_hideInputErrorFunc = this.onClick_hideInputErrorFunc.bind(this);
		this.onChange_Username = this.onChange_Username.bind(this);
		this.onChange_Password = this.onChange_Password.bind(this);
		this.onClick_Submit = this.onClick_Submit.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
		if (Config.isDebug) console.log("Login", "Mounted");
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("Login", "Unmounted");
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

	onChange_Password(e) {
		this.setState({
			password: e.target.value
		});
	}

	updatesRenderer_LoginSuccess() {
		this.URChildRef.current.addUpdates({ updateStr: "Login:" });
		this.URChildRef.current.addUpdates({
			updateStr: "Done",
			onNextLine: false,
			responseClass: "success",
			marginLeft: 2
		});
		this.URChildRef.current.addUpdates({
			updateStr: "Welcome,",
			onNextLine: true
		});
		const user = JSON.parse(localStorage.getItem('user'));
		this.URChildRef.current.addUpdates({
			updateStr: `${user.displayname}!`,
			onNextLine: false,
			responseClass: "important",
			marginLeft: 2
		});
		this.URChildRef.current.addUpdates({
			updateStr: "Redirecting you shortly...",
			onNextLine: true,
			nextLineShowPrompt: false
		});
	}

	updatesRenderer_LoginError_EmailNotVerified() {
		this.URChildRef.current.addUpdates({ updateStr: "Account Status:" });
		this.URChildRef.current.addUpdates({
			updateStr: "Unverified",
			onNextLine: false,
			responseClass: "error",
			marginLeft: 2
		});
		this.URChildRef.current.addUpdates({
			updateStr: "Check mailbox for verification mail.",
			onNextLine: true
		});
		this.URChildRef.current.addUpdates({ updateStr: "Get new mail:" });
		this.URChildRef.current.addUpdates({
			updateStr: `<a target="_blank" href="${process.env.PUBLIC_URL}${(Config.isHashRoute) ? '/#' : ''}${RoutesForClient.VerifyAccount}">Click Here</a>`,
			onNextLine: false,
			responseClass: "important",
			marginLeft: 2
		});
	}

	updatesRenderer_ServerError() {
		this.URChildRef.current.addUpdates({ updateStr: "Login:" });
		this.URChildRef.current.addUpdates({
			updateStr: "Failure",
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

		// Clearing UpdatesRenderer console
		this.URChildRef.current.addUpdates({ undefined });

		this.setState({
			isUser: false,
			isUserAdmin: false,
			result: "",
			inputDisabled: true,
			showErrors: false,
		});

		const user = {
			username: this.state.username,
			password: this.state.password
		};

		axios.post(APIRoutes.Login, user, { withCredentials: true }).then(res => {
			localStorage.setItem('user', JSON.stringify(res.data.user));
			this.updatesRenderer_LoginSuccess();
			setTimeout(() => {
				this.setState({
					isUser: true,
					isUserAdmin: res.data.user.isadmin,
				});
			}, 5000);

		}).catch(err => {
			//console.log(err);
			if (err.response) {
				if (err.response.data.status === 500) {
					//console.log(err.response.data);
					this.updatesRenderer_ServerError();
				} else if (err.response.data.status === 401.3) {
					this.setState({
						inputDisabled: false
					});
					this.updatesRenderer_LoginError_EmailNotVerified();
				} else {
					this.setState({
						inputDisabled: false,
						showErrors: true,
						errors: err.response.data
					});
					this.hideAllErrorsTimeoutFunc();
				}
			}
		});
	}

	render() {
		if (Config.isDebug) console.log("Login", "render", 'state', { 'isUser': this.state.isUser, 'isUserAdmin': this.state.isUserAdmin });
		return (
			<React.Fragment>
				{this.redirectToAdminHome()}
				{this.redirectToUserHome()}
				{this.renderLogin()}
			</React.Fragment>
		)
	};

	renderLogin() {
		return (
			<React.Fragment>
				<div className="container formContainer">
					<form onSubmit={this.onClick_Submit}>
						<div className="form-group">
							<h3>Login</h3>
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
						<div className="form-group text-left">
							<label>Password</label>
							<input type="password"
								required
								className="form-control tb"
								value={this.state.password}
								onChange={this.onChange_Password}
								disabled={this.state.inputDisabled}
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
						<div className="buttons">
							<Button type="submit"
								outline
								color="secondary"
								disabled={this.state.inputDisabled}
							>Login</Button>
						</div>
						<div className="container-fluid mb-2">
							<label>
								Hey! dum dum, Forgot password?
								<span style={{ fontSize: 20 }}>
									<Emoji symbol="🤦🏼‍♂️" label="FacePalm" />
								</span>
								<br />
								<FontAwesomeIcon
									icon={faHandPointRight}
									style={{ marginRight: 5 }} />
								<Link to={`${RoutesForClient.ForgotPassword}`}>
									Click Here
								</Link>
								<FontAwesomeIcon
									icon={faHandPointLeft}
									style={{ marginLeft: 5 }} />
							</label>
						</div>
						<UpdatesRenderer ref={this.URChildRef} />
					</form>
				</div>
			</React.Fragment>
		);
	};

	redirectToAdminHome() {
		if (this._isMounted && this.state.isUser && this.state.isUserAdmin) {
			return (
				<Redirect to={`${RoutesForClient.Admin.Home}`} />
			);
		}
	}

	redirectToUserHome() {
		if (this._isMounted && this.state.isUser && !this.state.isUserAdmin) {
			return (
				<Redirect to={`${RoutesForClient.User.Home}`} />
			);
		}
	}

}
