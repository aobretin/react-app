import React from 'react';
import {observer} from "mobx-react";

import CartDropdown from 'CartDropdown';
import LanguagesSelector from 'LanguagesSelector';
import CurrencySelector from 'CurrencySelector';
import UserDrop from 'UserDrop';

import {Link} from 'react-router-dom';
import Logo from '../../Assets/img/logo.png';

import TranslateWrapper from 'TranslateWrapper';

import PlaceholderConstructor from 'PlaceholderConstructor';

const ViewDesktop = props => {

	return (
		<header className="align-self-start flex">
			<div className="container align-self-center">
				<div className="row ">
					<div className="col-3 brand-col">
						<img src={Logo} alt="brandy" />  &nbsp;
						<TranslateWrapper component={'a'} className="" href="/" style={{color: '#fff'}} translateKey="homepage>>greeting from the other side" />
					</div>
					<PlaceholderConstructor slug="..header.1.." />
					<PlaceholderConstructor slug="..header.2.." />
					<div className="col-9 ml-auto row header-drops text-right no-gutters extended">
						<CurrencySelector />
						<LanguagesSelector />
						<CartDropdown />
						<UserDrop />
					</div>
				</div>
			</div>
		</header>


	)
}

export default observer(ViewDesktop);
