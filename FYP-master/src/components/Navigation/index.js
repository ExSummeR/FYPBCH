import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Image, Menu } from 'semantic-ui-react';

import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

/*
const condition = authUser => authUser != null;
is the same as 
const condition = authUser => !!authUser;
*/

const Navigation = () => (
  <div>
    <Menu>
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <NavigationAuth authUser={authUser}/> : <NavigationNonAuth />
        }
      </AuthUserContext.Consumer>
    </Menu>
  </div>
);
 
const NavigationAuth = ({ authUser }) => (
  <Container>
    <Menu.Item as="a" header>
      <Image size="small" src="/img/page/logo.svg" />
    </Menu.Item>
      {/* FOR NEW USER */}
      {!!authUser.isNewUser === true && (
      <Menu.Menu position="right">
        <Menu.Item as="a" name="Account">
          <Link to={ROUTES.ACCOUNT}>Account</Link>
        </Menu.Item>
        <Menu.Item as="a" name="Log Out">
          <SignOutButton>Log Out</SignOutButton>
        </Menu.Item>   
      </Menu.Menu>
      )}

      {/* FOR EXISTING USER */}
      {!!authUser.isNewUser === false && !!authUser.roles[ROLES.USER] && (
      <Menu.Menu position="right">
        <Menu.Item as="a" name="Home">
          <Link to={ROUTES.HOME}>Home</Link>
        </Menu.Item>
        <Menu.Item as="a" name="Account">
          <Link to={ROUTES.ACCOUNT}>Account</Link>
        </Menu.Item>
        <Menu.Item as="a" name="Log Out">
          <SignOutButton>Log Out</SignOutButton>
        </Menu.Item>   
      </Menu.Menu>
      )}

      {/* FOR ADMIN */}
      {!!authUser.isNewUser === false && !!authUser.roles[ROLES.ADMIN] && (
      <Menu.Menu position="right">
        <Menu.Item as="a" name="Home">
          <Link to={ROUTES.ADMIN_HOME}>Home</Link>
        </Menu.Item>
        <Menu.Item as="a" name="Account">
          <Link to={ROUTES.ACCOUNT}>Account</Link>
        </Menu.Item>
        <Menu.Item as="a" name="Admin">
          <Link to={ROUTES.ADMIN}>Admin</Link>
        </Menu.Item> 
        <Menu.Item as="a" name="Log Out">
          <SignOutButton>Log Out</SignOutButton>
        </Menu.Item>   
      </Menu.Menu>
      )}
  </Container>
);

const NavigationNonAuth = () => (
  <Container>
    <Menu.Item as="a" header>
      <Image size="small" src="/img/page/logo.svg" />
    </Menu.Item>
    <Menu.Menu position="right">
      <Menu.Item as="a" name="Login">
        <Link to={ROUTES.SIGN_IN}>Login</Link>
      </Menu.Item>
    </Menu.Menu>
  </Container>
);

export default Navigation;