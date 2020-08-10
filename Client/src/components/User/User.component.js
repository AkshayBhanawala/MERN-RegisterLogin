import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Config from '../../helpers/Config';
import UserHome from './UserHome.component';

export default class User extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
		};
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
		if (Config.isDebug) console.log("User", "Mounted");
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("User", "Unmounted");
	}

	render() {
		if (Config.isDebug) console.log("User", "render", this.state);
		return (
			<React.Fragment >
				{this.renderHome()}
			</React.Fragment >
		);
	};

	renderHome() {
		return (
			<Container>
				<UserHome />
			</Container>
		);
	};

}
