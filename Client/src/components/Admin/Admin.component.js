import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Config from '../../helpers/Config';
import AdminHome from './AdminHome.component';

export default class Admin extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
		};
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
		if (Config.isDebug) console.log("Admin", "Mounted");
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("Admin", "Unmounted");
	}

	render() {
		if (Config.isDebug) console.log("Admin", "render", this.state);
		return (
			<React.Fragment >
				{this.renderHome()}
			</React.Fragment >
		);
	};

	renderHome() {
		return (
			<Container>
				<AdminHome />
			</Container>
		);
	};

}