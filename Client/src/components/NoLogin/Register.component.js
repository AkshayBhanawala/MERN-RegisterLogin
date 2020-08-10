import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import Config from '../../helpers/Config';
import RoutesForClient from '../../helpers/RoutesForClient';
import APIRoutes from '../../helpers/APIRoutesForClient';
import UpdatesRenderer from '../_Custom/UpdatesRenderer';

export default class Register extends Component {

	constructor(props) {
		super(props);

		this.URChildRef = React.createRef();

		this.state = {
			email: '',
			username: '',
			password: '',
			displayname: '',
			inputDisabled: false,
			showErrors: false,
			errors: {},
			hideAllErrorsTimeout: () => { }
		};
		this.hideAllErrorsTimeoutFunc = this.hideAllErrorsTimeoutFunc.bind(this);
		this.onClick_hideInputErrorFunc = this.onClick_hideInputErrorFunc.bind(this);
		this.onChange_Email = this.onChange_Email.bind(this);
		this.onChange_Username = this.onChange_Username.bind(this);
		this.onChange_Password = this.onChange_Password.bind(this);
		this.onChange_DisplayName = this.onChange_DisplayName.bind(this);
		this.onClick_Submit = this.onClick_Submit.bind(this);
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

	onChange_Email(e) {
		this.setState({
			email: e.target.value
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

	onChange_DisplayName(e) {
		this.setState({
			displayname: e.target.value
		});
	}

	updatesRenderer_RegisterSuccess_1() {
		this.URChildRef.current.addUpdates({ updateStr: "Registration:" });
		this.URChildRef.current.addUpdates({
			updateStr: "Done",
			onNextLine: false,
			responseClass: "success",
			marginLeft: 2
		});
		this.URChildRef.current.addUpdates({ updateStr: "Verification email:" });
	}

	updatesRenderer_RegisterSuccess_2({ ExpiresInHours = 1 }) {
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

	updatesRenderer_RegisterError_1() {
		this.URChildRef.current.addUpdates({ updateStr: "Registration:" });
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

	updatesRenderer_RegisterError_2() {
		this.URChildRef.current.addUpdates({
			updateStr: "Not sent",
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
		// Prevent form submission
		e.preventDefault();

		// Clearing error timeouts
		clearTimeout(this.state.hideAllErrorsTimeout);

		// Updating status in update div
		this.URChildRef.current.addUpdates({ undefined });

		// Set initial state
		this.setState({
			inputDisabled: true,
			showErrors: false,
			updates: "",
		});

		// Get User Data
		const user = {
			email: this.state.email,
			password: this.state.password,
			username: this.state.username,
			displayname: this.state.displayname
		};

		axios.post(APIRoutes.Register, user, { withCredentials: true }).then((res) => {
			// User Registered in database
			this.updatesRenderer_RegisterSuccess_1();

			const DATA = {
				publicURLPart: `${process.env.PUBLIC_URL}${(Config.isHashRoute) ? '/#' : ''}${RoutesForClient.Verify}`,
				user: res.data.user,
			};
			axios.post(APIRoutes.SendAccountVerificationEmail, DATA, { withCredentials: true }).then((res) => {
				// Verification email sent
				this.updatesRenderer_RegisterSuccess_2(res.data.verifyaccount.ExpiresInHours);
			}).catch((err) => {
				// Verification email sending error
				//console.log(err.response.data);
				this.updatesRenderer_RegisterError_2();
			});
		}).catch((err) => {
			//console.log(err);
			//checking for error for mobile device
			if (err.response) {
				//no mobile device errors
				if (err.response.status === 500 || err.response.data.status === 500) {
					// User Registration in database error
					//console.log(err.response.data);
					this.updatesRenderer_RegisterError_1();
				} else {
					this.hideAllErrorsTimeoutFunc();
					this.setState({
						inputDisabled: false,
						showErrors: true,
						errors: err.response.data
					});
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
						<h3>Register</h3>
					</div>
					<div className="form-group text-left">
						<input type="email"
							required
							placeholder="Email"
							className="form-control tb"
							value={this.state.email}
							onChange={this.onChange_Email}
						/>
						<div htmlFor='email' className={`text-danger inputError ${
							(this.state.showErrors && this.state.errors.email) ? "show" : "hide"}`}
							onClick={this.onClick_hideInputErrorFunc}>
							{
								this.state.errors.email
									? this.state.errors.email.message
									: ""
							}
						</div>
					</div>
					<div className="form-group text-left">
						<input type="text"
							required
							placeholder="Username"
							className="form-control tb"
							//pattern="^[A-Za-z][A-Za-z0-9].*$"
							value={this.state.username}
							onChange={this.onChange_Username}
						/>
						<div htmlFor='username'  className={`text-danger inputError ${
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
						<input type="password"
							required
							placeholder="Password"
							className="form-control tb"
							value={this.state.password}
							onChange={this.onChange_Password}
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
					<div className="form-group text-left">
						<input type="text"
							required
							placeholder="What to call you?"
							className="form-control tb"
							//pattern="^[A-Za-z ]+$"
							value={this.state.displayname}
							onChange={this.onChange_DisplayName}
						/>
						<div htmlFor='displayname' className={`text-danger inputError ${
							(this.state.showErrors && this.state.errors.displayname) ? "show" : "hide"}`}
							onClick={this.onClick_hideInputErrorFunc}>
							{
								this.state.errors.displayname
									? this.state.errors.displayname.message
									: ""
							}
						</div>
					</div>
					<div className="form-group">
						<Button type="submit"
							outline
							color="secondary"
						>Register</Button>
					</div>
					<UpdatesRenderer ref={this.URChildRef} />
				</form>
			</div>
		)
	}
}
