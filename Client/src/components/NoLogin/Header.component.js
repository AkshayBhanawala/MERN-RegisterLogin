import React, { Component } from 'react';
import { Link } from "react-router-dom";
import RoutesForClient from '../../helpers/RoutesForClient';
import TH3AZ_Outline from '../../assets/svg/TH3AZ [SizeOnly].svg';

export default class Welcome extends Component {
	render() {
		return (
			<div className="logo_th3az">
				<Link to={`${RoutesForClient.Welcome}`}>
					<img alt="Logo" src={TH3AZ_Outline} />
				</Link>
			</div>
		);
	};

}
