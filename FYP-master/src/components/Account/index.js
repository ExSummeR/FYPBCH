import React from 'react';
import Moment from 'react-moment';

import { AuthUserContext, withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

import PasswordChangeForm from '../PasswordChange';
import AccountDetailsChangeForm from '../AccountDetailsChange';

const dateToFormat = new Date(); // e.g. Mon Apr 19 1976 09:59:00 GMT-0800

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <Moment format="ddd D MMM YYYY" date={dateToFormat} />
        <h1>Welcome {authUser.username}</h1>
        <div class="customFontSmall">Email: {authUser.email}</div>
        <div class="customFontSmall">Contact Number: {authUser.contactNumber}</div>

        {!!authUser.isNewUser === false && !!authUser.roles[ROLES.USER] && (
        <div class="customFontSmall">Role: Store Associate</div>
        )}

        {!!authUser.isNewUser === false && !!authUser.roles[ROLES.ADMIN] && (
        <div class="customFontSmall">Level: Admin</div>
        )}

        {!!authUser.isNewUser === true && (
        <div class="customFontSmall">Role: Store Associate (please reset your password)</div>
        )}
        <p></p>
        <AccountDetailsChangeForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(AccountPage);
