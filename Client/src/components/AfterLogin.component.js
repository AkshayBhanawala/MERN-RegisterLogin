import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Switch, Route, Redirect } from "react-router-dom";
import axios from 'axios';
import Config from '../helpers/Config';
import APIRoutes from '../helpers/APIRoutesForClient';
import RoutesForClient from '../helpers/RoutesForClient';
import User from './User/User.component';
import Admin from './Admin/Admin.component';
import App from '../App';

export default class AfterLogin extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			isUser: false,
			isUserAdmin: undefined,
			userDisplayName: undefined,
		};

		this.onClick_Logout = this.onClick_Logout.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
		if (Config.isDebug) console.log("AfterLogin", "Mounted");
		this.isUserLoggedIn();
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("AfterLogin", "Unmounted");
	}

	isUserLoggedIn() {
		this.setState({
			isUser: false,
			isUserAdmin: undefined,
		});
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
					userDisplayName: user.displayName,
				});
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

	onClick_Logout(e) {
		e.preventDefault();
		axios.post(APIRoutes.Logout, undefined, { withCredentials: true }).then(res => {
			localStorage.removeItem("user");
			this.setState({
				isUser: false,
				isUserAdmin: undefined,
			});
		}).catch(err => {
			console.log(err.response);
		});
	};

	render() {
		if (Config.isDebug) console.log("AfterLogin", "render", this.state);
		return (
			<React.Fragment>
				{this.redirectToLogin()}
				{this.renderHome()}
				{this.redirectToAdminHome()}
				{this.redirectToUserHome()}
			</React.Fragment>
		);
	};

	renderHome() {
		if (this._isMounted && this.state.isUser) {
			return (
				<React.Fragment>
					<h1>Welcome {this.state.userDisplayName}</h1>
					<Switch name='Admin'>
						<Route path={`${RoutesForClient.Admin.Home}`} exact component={Admin} />
					</Switch>
					<Switch name='User'>
					<Route path={`${RoutesForClient.User.Home}`} exact component={User} />
					</Switch>
					<Button onClick={this.onClick_Logout}>Logout</Button>
				</React.Fragment>
			);
		}
	};

	redirectToLogin() {
		if (this._isMounted && !this.state.isUser) {
			return (
				<React.Fragment>
					<App />
					<Redirect to={`${RoutesForClient.Welcome}`} />
				</React.Fragment>
			);
		}
	}

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
