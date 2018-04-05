import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import {CSSTransitionGroup} from 'react-transition-group';

import AsyncComponent from 'AsyncComponent';
import DynamicTemplateConstructor from 'DynamicTemplateConstructor';

import Config from 'Config';

import {NotificationContainer} from 'react-notifications';
// import {NotificationManager} from 'react-notifications'; .. where needed to be called
// import Popup from 'react-popup';
// import ModalWrapper from 'ModalWrapper';
//
// import LoginForm from 'LoginForm';
// import RegisterForm from 'RegisterForm';

import {withRouter, Redirect} from 'react-router-dom';
import {getCookie} from 'Cookies';

import './Themes/DefaultTemplate/Assets/scss/bootstrap/scss/bootstrap.scss';
import 'react-dates/lib/css/_datepicker.css';
import './Themes/DefaultTemplate/Assets/scss/main.scss';

import ApiService from 'ApiService';

import {Helmet} from 'react-helmet';
import {compileTemplate} from 'CMSMethods';

import {extendObservable, observable} from "mobx";
import {observer, inject} from "mobx-react";

const Header = AsyncComponent(() => import('Header'));
const Footer = AsyncComponent(() => import('Footer'));

const Frontpage = AsyncComponent(() => import('Frontpage'));
const Book = AsyncComponent(() => import('Book'));
const Checkout = AsyncComponent(() => import('Checkout'));
const Dashboard = AsyncComponent(() => import('Dashboard'));
const HotelDetails = AsyncComponent(() => import('HotelDetails'));
const List = AsyncComponent(() => import('List'));

const Popup = AsyncComponent(() => import('react-popup'));
const ModalWrapper = AsyncComponent(() => import('ModalWrapper'));
const LoginForm = AsyncComponent(() => import('LoginForm'));
const RegisterForm = AsyncComponent(() => import('RegisterForm'));

@withRouter
@inject("cartData", "view", "languagesData", "user")
@observer
class App extends Component {
	constructor(props) {
	  super(props);

		extendObservable(this, {
	  		appReady: false,
	  		allow: {
	  			Header: '1',
	  			Footer: '1'
	  		},
			pagesRoutes: []
		})

		window.addEventListener('resize', this.checkDeviceType);
	}

	_regenarateCartData(){
			//cart data
			let data = {};

			//random generated id for cart
    	const min = Math.ceil(5);
    	const max = Math.floor(9999);

		  //object containing newly create cart data
      data = {
        cartId: Math.floor(Math.random() * (max - min + 1)) + min,//random generated card id
        itemsCount: 0,//no of items, initialy 0
        timestamp: Date.now()//created time
      }

      //sets data on provider
      this.props.cartData.cartId = data.cartId;
      this.props.cartData.itemsCount = data.itemsCount;
      this.props.cartData.timestamp = data.timestamp;

      //store data in localStorage
      localStorage.setItem('userCart', JSON.stringify(data));

	}

	componentWillMount() {
		//dynamic routes from CMS
		let pagesRoutes = [];

    //methods from UserProvider
		const {
			getUserCookieName,
			setUserData,
			checkIfLoginTimeExpired
		} = this.props.user;

		//get cookie name
		const cookie_name = getUserCookieName();

		//if cookie set then sets user data from cookie
		if (getCookie(cookie_name)) {
			let userData = getCookie(cookie_name);

			setUserData(userData);
			checkIfLoginTimeExpired();
		}

		//construct the service object generated from cart req
		Object.keys(this.props.cartData.items).forEach(item => {
			 if (!this.props.cartData.items[item].services) this.props.cartData.items[item].services = {}
		});

		//gets all full pages from CMS editor in order to generate dynamic routes
		ApiService.getCmsPages().then(res => {
			//all pages from CMS
			const pages = res.data._embedded.pages;

			Object.keys(pages).forEach(page => pagesRoutes.push(pages[page].Name));

			this.pagesRoutes = pagesRoutes.slice();

		/**
		 * [if checks if cart has any stored data]
		 * @param  {[Bool]} !localStorage.getItem('userCart')
		 */
	    if (!localStorage.getItem('userCart')) {
	    	  this._regenarateCartData();

	    	  //boostraps the app
      		this.appReady = true;
	    } else {
	    	let data = {};

	    	//if data already exists gets the card data and parse it
		      data = localStorage.getItem('userCart');
		      data = JSON.parse(data);

		      //sets data on provider
		      this.props.cartData.cartId = data.cartId;
		      this.props.cartData.itemsCount = data.itemsCount;
		      this.props.cartData.timestamp = data.timestamp;

		      //if there are no items, boostraps the app and returns
		      if (data.itemsCount == 0) {
		        this.appReady = true;
		        return false;
		      }

		      //validates if current is bigger than the expiry date
		      if (Date.now() - data.timestamp >= this.props.cartData.EXPIRY_TIME) {
		        alert('The items in your cart have expired... The cart is now empty');

		      	//then the cart is emptied and regenerated
		        this._regenarateCartData();

		    	  //boostraps the app
	      		this.appReady = true;

		      } else {
		      	//gets the cart items and set them on provider
		        this.props.cartData.methods.getFromBucket().then(res => {

		          if (res.status < 400) {
		          	//sets items on cart
		            this.props.cartData.items = res.data.hits.hits[0]._source.Content.Object.items;
		            //sets total number of items
		            this.props.cartData.itemsCount = res.data.hits.hits[0]._source.Content.Object.itemsCount;
								//computes total price of items
								this.props.cartData.methods.computeTotal();

								//construct the service object generated from cart req
								Object.keys(this.props.cartData.items).forEach(item => {
									if (!this.props.cartData.items[item].services) this.props.cartData.items[item].services = {}
								});

								//boostraps the app
		            this.appReady = true;
		          }
		        }).catch((res) => {
		           console.log(res);
		        });
		      }
		    }
		});

	}

	//sets header or footer depending on CMS options - if the CMS page was defined with default header or footer
	headerFooterSetter = state => this.allow = state;

	//checks device view in order to proper view
	checkDeviceType = () => this.props.view.device = window.screen.width <= Config.MobileBreakpoint ? 'MOBILE' : 'DESKTOP';

	//renders dynamic template from CMS
	renderDynamicTemplate = name => <DynamicTemplateConstructor slug={name} headerFooterSetter={this.headerFooterSetter}/>;

	render() {
		//deconstracting necessary methods and data from props
		const {
			user: {
				getUserFormStatus,
				getUserFormStates,
				setUserFormStatus
			},
			languagesData: {
				activeLanguage: {
					isRtl
				}
			},
			location
		} = this.props;

		const {
			pathname,
			key
		} = location;

		const formStatus = getUserFormStatus();
		const FORM_STATES = getUserFormStates();

		const {
			LOGIN,
			REGISTER
		} = FORM_STATES;

		let formInfo = {
			title: '',
			content: null
		};

		switch (formStatus) {
			case LOGIN:
				formInfo.title = 'Login';
				formInfo.content = <LoginForm />
				break;
			case REGISTER:
				formInfo.title = 'Register';
				formInfo.content = <RegisterForm />
				break;
		}


	  	return (
			<div id="Page" className={`container-fluid ${pathname == "/" ? 'bg-img' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
				{
					this.allow.Header != '1' ? <div>{compileTemplate(this.allow.Header)}</div> : <Header />
				}
				<content className="align-self-center">

					<NotificationContainer />
					<Popup closeOnOutsideClick={false} />
					<ModalWrapper isOpen={formStatus.length > 0} onRequestClose={() => setUserFormStatus('')} title={formInfo.title}>
						{formInfo.content}
					</ModalWrapper>
					{
						this.appReady
							?
								<CSSTransitionGroup transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={1}>
									<Switch location={location} key={key}>
										<Route exact path='/' component={Frontpage} />
										<Route path='/list/:SIDS/:type' component={List} />
										{
											Config.HotelSeparateDetailsPage && (
												<Route path='/hotel-details/:hotelCode/:hotelId' component={HotelDetails} />
											)
										}
										<Route path='/checkout' component={Checkout} />
										<Route path='/book' component={Book} />
										<Route path='/dashboard' component={Dashboard} />

										{
											this.pagesRoutes.map((route, idx) => <Route key={idx} path={`/${route}`} render={() => this.renderDynamicTemplate(route)} />)
										}

										{/* Default route */}
										<Route render={ () => <h1 style={{textAlign: 'center'}}>Not found</h1> } />
									</Switch>
								</CSSTransitionGroup>
							:
							<h1 className="text-center">Loading app...</h1>
					}

				</content>
				{
					this.allow.Footer != '1' ? <div>{compileTemplate(this.allow.Footer)}</div> : <Footer />
				}
			</div>
	  	)
	}
}

export default App;
