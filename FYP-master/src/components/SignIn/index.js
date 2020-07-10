import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
 
const SignInPage = () => (
  <div>
    <SignInForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
 
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { email, password } = this.state;
 
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.ACCOUNT);
      })
      .catch(error => {
        this.setState({ error });
      });
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const { email, password, error } = this.state;
 
    const isInvalid = password === '' || email === '';
 
    return (
      <Grid centered columns={2}>
        <Grid.Column>
          <Header as="h1" textAlign="center">
            <h1>Login</h1>
          </Header>
          <Segment>
            <Form size="large" onSubmit={this.onSubmit}>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder="Email address"
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                name="password"
                value={password}
                onChange={this.onChange}
                placeholder="Password"
                type="password"
              />
    
              <Button disabled={isInvalid} color="red" fluid size="large" type="submit">
                Login
              </Button>
              {error && <div class="customFontBlack">{error.message}</div>}
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
 
const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);
 
export default SignInPage;
 
export { SignInForm };
