/* eslint-disable */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {extendObservable, observable} from "mobx";
import {observer, inject} from "mobx-react";

import {NotificationManager} from 'react-notifications';

import {setCookie, removeCookie} from 'Cookies';

const AccountCore = (View) => {
	 return @inject("user") @observer class extends Component {
  	static propTypes = {}

    static defaultProps = {}

		constructor(props) {
			super(props);

			extendObservable(this, {
				goTo: ''
			})
		}

		componentWillMount() {
			const {
				setAllowDashboard,
				isAuth
			} = this.props.user;

			setAllowDashboard(isAuth());
		}

		redirectTo = url => {
			this.goTo = url;
			setTimeout(() => this.goTo = '', 500);
		}

    logIn = (data, callback = () => {}) => {
      const {
        loginUser,
        logoutUser,
        setUserData,
        checkIfLoginTimeExpired,
        getUserCookieName,
				setAllowDashboard
      } = this.props.user;

      loginUser(data).then(res => {
        const newUserData = {
          auth: true,
          id: res.data.Id,
          name: res.data.Name,
          email: res.data.Email
        }

        setUserData(newUserData);
        setCookie(getUserCookieName(), newUserData);

				setAllowDashboard(true);
        checkIfLoginTimeExpired();
				NotificationManager.success('Successfully logged in');
				callback(res);
      }).catch(res => {
        console.error(res);
				NotificationManager.error('Could not log you in');
        logoutUser();
				callback(res);
      });
    }

    register = (data, callback = () => {}) => {
      const {
        registerUser,
        setUserData,
        checkIfLoginTimeExpired,
        getUserCookieName,
				setAllowDashboard
      } = this.props.user;

      registerUser(data).then(res => {
        const newUserData = {
          auth: true,
          id: res.data.Id,
          name: res.data.Name,
          email: res.data.Email
        }

        setUserData(newUserData);
        setCookie(getUserCookieName(), newUserData);

				setAllowDashboard(true);
        checkIfLoginTimeExpired();
				NotificationManager.success('Successfully registered');
        callback(res);
      }).catch(res => {
				NotificationManager.error('Could not register');
				console.log(res)
				callback(res);
			});
    }

    logOut = (callback = () => {}) => {
      const {
        logoutUser,
        setUserData,
        clearTimer,
        getUserCookieName,
				setAllowDashboard
      } = this.props.user;

      logoutUser().then(res => {
        const newUserData = {
          auth: false,
          id: '',
          name: '',
          email: ''
        }

        setUserData(newUserData);
        removeCookie(getUserCookieName());
				setAllowDashboard(false);
        clearTimer();
				NotificationManager.success('Successfully logged out');

        callback(res);
      }).catch(res => {
				NotificationManager.error('Could not log you out');
				callback(res);
				console.log(res);
			});
    }

		render(){
			return (
	        <View
						goTo={this.goTo}
            logIn={this.logIn}
            logOut={this.logOut}
            register={this.register}
						redirectTo={this.redirectTo}
            {...this.props}
          >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default AccountCore;
