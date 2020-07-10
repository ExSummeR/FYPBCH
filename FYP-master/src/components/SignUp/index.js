import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  contactNumber: '',
  error: null,
};

const SignUpPage = () => (
  <div>
    <div class="customHeader">Create a New Account</div>
    <SignUpForm />
  </div>
);
 
class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { username, email, passwordOne, isAdmin, contactNumber } = this.state;
    const roles = {};
    const isNewUser = true; // If true, user needs to change password at first login

    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }
    else if (!isAdmin) {
      roles[ROLES.USER] = ROLES.USER;
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
            contactNumber,
            roles,
            isNewUser, // If true, user needs to change password at first login
          });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.firebase.doSignOut();
        this.props.history.push(ROUTES.SIGN_IN);
        window.alert("Account Creation Successful! Please log-in again.");
      })
      .catch(error => {
        this.setState({ error });
      });
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      contactNumber,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' ||
      contactNumber === '';

    return (
      <Grid centered columns={3}>
      <Grid.Column>
      <Segment>
      <Form size="small" onSubmit={this.onSubmit}>
        <Form.Input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"
        />
        <Form.Input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <Form.Input
          name="contactNumber"
          value={contactNumber}
          onChange={this.onChange}
          type="text"
          placeholder="Contact Number"
        />
        <Form.Input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <Form.Input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />

        <label class="customFontBlack">
          Admin:
          <input
            name="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={this.onChangeCheckbox}
          />
        </label>

        <Button disabled={isInvalid} color='blue' floated='right' type="submit">Create</Button>
 
        {error && <p>{error.message}</p>}
      </Form>
      </Segment>
      </Grid.Column>
      </Grid>
    );
  }
}
 
const SignUpLink = () => (
  <p>
    Create a store associate account here. Click <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);
 
export default SignUpPage;
 
export { SignUpForm, SignUpLink };