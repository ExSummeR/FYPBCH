// Menu.js
import React from 'react';
import { bool } from 'prop-types';

import { StyledMenu } from './Menu.styled';
import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';
import * as ROLES from '../../constants/roles';

// Choose icons hexcode from http://www.nogginbox.co.uk/Media/Default/BlogPost/segoe.html

const Menu = ({ open }) => {
  return (
    <AuthUserContext.Consumer>
    {authUser => authUser && (
      <StyledMenu open={open}>
        {!!authUser.isNewUser === false && !!authUser.roles[ROLES.ADMIN] && (
        <div>
          <li>
            <a href="/admin-home">
              <span role="img" aria-label="admin-home">&#x1f3e0;</span>
              Home
            </a>
          </li>
          <li>
            <a href="/account">
              <span role="img" aria-label="account">&#xe115;</span>
              Account
            </a>
          </li>
          <li>
            <a href="/admin">
              <span role="img" aria-label="admin">&#xe13d;</span>
              Admin
            </a>
          </li>
        </div>
        )}

        {!!authUser.isNewUser === false && !!authUser.roles[ROLES.USER] && (
        <div>
          <li>
            <a href="/home">
              <span role="img" aria-label="home">&#x1f3e0;</span>
              Home
            </a>
          </li>
          <li>
            <a href="/account">
              <span role="img" aria-label="account">&#xe115;</span>
              Account
            </a>
          </li>
        </div>
        )}

        {!!authUser.isNewUser === true && (
        <div>
          <li>
            <a href="/account">
              <span role="img" aria-label="account">&#xe115;</span>
              Account
            </a>
          </li>
        </div>
        )}
        <SignOutButton></SignOutButton>
      </StyledMenu>
    )}
    </AuthUserContext.Consumer>
  )
}
Menu.propTypes = {
  open: bool.isRequired,
}
export default Menu;