import React, { Component } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { Container } from 'reactstrap';
import axios from 'axios';
import Config from './helpers/Config';
import APIRoutes from './helpers/APIRoutesForClient';
import RoutesForClient from './helpers/RoutesForClient';
import Welcome from './components/NoLogin/Welcome.component';
import AfterLogin from './components/AfterLogin.component';

export default class App extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
			isUser: false,
			isUserAdmin: undefined,
		};
	}

	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log("App", "Mounted");
		// Code to run when component is loaded
		this.isUserLoggedIn();
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("App", "Unmounted");
	}

	async isUserLoggedIn() {
		var user = localStorage.getItem("user");
		if (user) {
			user = JSON.parse(user);
			const expDate = new Date(user.exp * 1000);
			const curDate = new Date();
			if (curDate > expDate) {
				localStorage.removeItem("user");
				user = undefined;
			}
			if (user && this._isMounted) {
				this.setState({
					isUser: true,
					isUserAdmin: user.isadmin,
				});
			}
		} else {
			try {
				var res = await axios.post(APIRoutes.IsLoggedIn, undefined, { withCredentials: true });
				if (Config.isDebug) console.log("Got response");
			} catch (err) {
				//console.log(err);
				//checking for error for mobile device
				if (err.response) {
					//showing error for other
					console.log(err.response);
				} else {
					//showing error for mobile device
					if (this._isMounted) {
						this.setState({
							result: JSON.stringify(err, null, 2)
						});
					}
				}
			}
			if (this._isMounted) {
				if (res.data.isLoggedIn) {
					localStorage.setItem("user", JSON.stringify(res.data.user));
					this.setState({
						isUser: true,
						isUserAdmin: res.data.user.isadmin,
					});
				} else {
					this.setState({
						isUser: false,
						isUserAdmin: undefined,
					});
				}
			}
		}
		if (Config.isDebug) {
			user = localStorage.getItem("user");
			if (user) {
				user = JSON.parse(user);
			}
			console.log("App", "isLoggedIn", 'state', this.state);
		}
	}

	render() {
		if (Config.isDebug) console.log("App", "render", this.state);
		return (
			<Container>
				{this.redirectToAdminHome()}
				{this.redirectToUserHome()}
				{this.renderWelcome()}
			</Container>
		);
	};

	renderWelcome() {
		if (this._isMounted && !this.state.isUser) {
			return (
				<Container>
					<Switch name='Welcome'>
						<Route path={`/:NoLogin?/:token?`} exact component={Welcome} />
					</Switch>
					<Switch name='AfterLogin'>
					<Route path={`/Users/:UserType`} exact component={AfterLogin} />
					</Switch>
				</Container>
			);
		}
	}

	redirectToAdminHome() {
		if (this._isMounted && this.state.isUser && this.state.isUserAdmin) {
			return (
				<React.Fragment>
					<AfterLogin />
					<Redirect to={`${RoutesForClient.Admin.Home}`} />
				</React.Fragment>
			);
		}
	}

	redirectToUserHome() {
		if (this._isMounted && this.state.isUser && !this.state.isUserAdmin) {
			return (
				<React.Fragment>
					<AfterLogin />
					<Redirect to={`${RoutesForClient.Admin.Home}`} />
				</React.Fragment>
			);
		}
	}

}