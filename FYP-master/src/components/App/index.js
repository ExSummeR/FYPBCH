import React, { Fragment } from 'react';
import { useState, useRef } from 'react';
import { useOnClickOutside } from '../../hooks';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
 
import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import AdminHomePage from '../AdminHome';
import ReportDetails from '../ReportDetails';
import FeedbackDetails from '../FeedbackDetails';
import ReportDetailsUser from '../ReportDetailsUser';
import FeedbackDetailsUser from '../FeedbackDetailsUser';

import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from '../../global';
import { theme } from '../../theme';
import { Burger, Menu } from '../../components';

import * as ROUTES from '../../constants/routes';
import { withAuthentication  } from '../Session';


function App() {
  const node = useRef(); 
  useOnClickOutside(node, () => setOpen(false));
  const [open, setOpen] = useState(false);
  return (
  <ThemeProvider theme={theme}>
  <GlobalStyles />
  <Router>
    <div>
    <Fragment>
      <Navigation />
        <hr />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
        <Route path={ROUTES.ADMIN_HOME} component={AdminHomePage} />
        <Route path={ROUTES.REPORT_DETAILS} component={ReportDetails} />
        <Route path={ROUTES.FEEDBACK_DETAILS} component={FeedbackDetails} />
        <Route path={ROUTES.REPORT_DETAILS_USER} component={ReportDetailsUser} />
        <Route path={ROUTES.FEEDBACK_DETAILS_USER} component={FeedbackDetailsUser} />
    </Fragment>
    </div>
  </Router>
  <div ref={node}>
    <Burger open={open} setOpen={setOpen} />
    <Menu open={open} setOpen={setOpen} />
  </div>
  </ThemeProvider>
  );
}
 
export default withAuthentication(App);