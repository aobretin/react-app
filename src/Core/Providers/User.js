import {observable} from "mobx";
import $ from "jquery";

import UserAccount from 'UserAccount';
import MyReservations from 'MyReservations';

import ApiService from 'ApiService';

import {removeCookie} from 'Cookies';

const USER_COOKIE_NAME = 'user-data';
const CHECK_LOGGED_TIME = 60000;
const LOGGED_OUT_AFTER = 30;
const USER_TYPE_ID = '59';

const URLS = {
  LOG_IN: '/auth/login',
  REGISTER: '/auth/register',
  LOG_OUT: '/auth/logout'
}

const FORM_STATES = {
  LOGIN: 'login',
  REGISTER: 'register'
}

const DASHBOARD_SERVICES = [
  {
    name: 'User account',
    component: UserAccount
  },
  {
    name: 'My Reservations',
    component: MyReservations
  }
]

let idleInterval = null;
let idleTime = 0;

const timerIncrement = time => {
  time = ++idleTime;

  if (time >= LOGGED_OUT_AFTER) {
      clearTimer();
      removeCookie(USER_COOKIE_NAME);

      UserProvider.values.methods.logoutUser();
      UserProvider.values.methods.setUserData({
        auth: false,
        id: '',
        name: '',
        email: ''
      });
  }

  return false;
}

const clearTimer = () => clearInterval(idleInterval);

class UserProvider {
  static values = observable({
    user_form_status: '',
    allowDashboard: false,
    info: {
      id: '',
      name: '',
      email: '',
      auth: false
    },
    methods: {
      isAuth: () => UserProvider.values.info.auth,

      setUserData: (data = {}) => UserProvider.values.info = Object.assign({}, UserProvider.values.info, data),
      setUserFormStatus: status => UserProvider.values.user_form_status = status,
      setAllowDashboard: allow => UserProvider.values.allowDashboard = allow,

      getUserData: (key = 'name') => typeof key === 'string' ? UserProvider.values.info[key] : UserProvider.values.info,
      getUserFormStatus: () => UserProvider.values.user_form_status,
      getAllowDashboard: () => UserProvider.values.allowDashboard,
      getUserCookieName: () => USER_COOKIE_NAME,
      getUserFormStates: () => FORM_STATES,
      getUserTypeID: () => USER_TYPE_ID,
      getDashboardServices: () => DASHBOARD_SERVICES,

      checkIfLoginTimeExpired: () => {
          idleInterval = setInterval(timerIncrement.bind(null, idleTime), CHECK_LOGGED_TIME);

          $(document).on('mousemove', e => idleTime = 0);
          $(document).on('keypress', e => idleTime = 0);
      },

      clearTimer: clearTimer,

      loginUser: data => ApiService.req(URLS.LOG_IN, 'post', data),
      registerUser: data => ApiService.req(URLS.REGISTER, 'post', data),
      logoutUser: () => ApiService.req(URLS.LOG_OUT, 'post', null)
    }
  })
}

export default UserProvider;
