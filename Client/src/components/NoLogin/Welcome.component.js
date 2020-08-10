import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import './Welcome.component.css';
import Config from '../../helpers/Config';
import RoutesForClient from '../../helpers/RoutesForClient';
import Header from './Header.component';
import SignInSignUp from './SignInSignUp.component';
import Login from './Login.component';
import Register from './Register.component';
import ForgotPassword from './ForgotPassword.component';
import PasswordReset from './PasswordReset.component';
import VerifyAccount from './VerifyAccount.component';
import Verify from './Verify.component';

export default class Welcome extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
		};
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
		if (Config.isDebug) console.log("Welcome", "Mounted");
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("Welcome", "Unmounted");
	}

	render() {
		if (Config.isDebug) console.log("Welcome", "render", this.state);
		return this.renderHome();
	};

	renderHome() {
		return (
			<React.Fragment>
				<Header />
				<Switch name='Home'>
					<Route path={`${RoutesForClient.Welcome}`} exact component={SignInSignUp} />
				</Switch>
				<Switch name='Login'>
					<Route path={`${RoutesForClient.Login}`} exact component={Login} />
				</Switch>
				<Switch name='Register'>
					<Route path={`${RoutesForClient.Register}`} exact component={Register} />
				</Switch>
				<Switch name='ForgotPassword'>
					<Route path={`${RoutesForClient.ForgotPassword}`} exact component={ForgotPassword} />
				</Switch>
				<Switch name='PasswordReset/:token?'>
					<Route path={`${RoutesForClient.PasswordReset}/:token?`} exact component={PasswordReset} />
				</Switch>
				<Switch name='VerifyAccount'>
					<Route path={`${RoutesForClient.VerifyAccount}`} exact component={VerifyAccount} />
				</Switch>
				<Switch name='Verify/:token?'>
					<Route path={`${RoutesForClient.Verify}/:token?`} exact component={Verify} />
				</Switch>
			</React.Fragment>
		);
	};

}
