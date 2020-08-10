import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { Container, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faCircle } from '@fortawesome/free-solid-svg-icons';
import RoutesForClient from '../../helpers/RoutesForClient';
import './SignInSignUp.component.css';

export default class SignInSignUp extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
			isUser: false,
			isUserAdmin: false,
		};
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
		//this.isUserLoggedIn();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	isUserLoggedIn() {
		var user = localStorage.getItem("user");
		if (user) {
			user = JSON.parse(user);
			this.setState({
				showUI: false,
				isUser: true,
				isUserAdmin: user.isadmin,
			});
		}
	}

	render() {
		if (this.state.isUser) {
			if (this.state.isUserAdmin) {
				return this.redirectToAdminHome();
			} else {
				return this.redirectToUserHome();
			}
		} else {
			return this.renderSignInSignUp();
		}
	};

	renderSignInSignUp() {
		return (
			<Container className="operations">
				<Col>
					<Link to={`${RoutesForClient.Login}`} className='link'>
						<div>
							<FontAwesomeIcon
								icon={faSignInAlt}
								mask={faCircle}
								transform="shrink-3"
								style={{}} />
						</div>
						<div>Sign In</div>
					</Link>
				</Col>
				<Col>
					<Link to={`${RoutesForClient.Register}`} className='link'>
						<div>
							<FontAwesomeIcon
								icon={faUserPlus}
								mask={faCircle}
								transform="shrink-5.5 right-0.8"
								style={{}} />
						</div>
						<div>Register</div>
					</Link>
				</Col>
			</Container>
		);
	};

	redirectToUserHome() {
		return (
			<React.Fragment>
				{/* <User /> */}
				<Redirect to={`${RoutesForClient.User.Home}`} />
			</React.Fragment>
		);
	};

	redirectToAdminHome() {
		return (
			<React.Fragment>
				{/* <Admin /> */}
				<Redirect to={`${RoutesForClient.Admin.Home}`} />
			</React.Fragment>
		);
	};

}
