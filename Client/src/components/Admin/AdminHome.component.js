import React, { Component } from 'react';

export default class AdminHome extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
		};
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		return (
			<React.Fragment>
				{this.renderHome()}
			</React.Fragment>
		);
	}

	renderHome() {
		return (
			<div className="container">
				<h2>Admin Home</h2>
			</div>
		);
	}

}
