import React, { Component } from 'react';
import { Button, Form, Grid } from 'semantic-ui-react';
import { withFirebase } from '../Firebase';
 
const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};
 
class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { passwordOne } = this.state;
 
    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    this.props.firebase.doUpdateCurrentUserStatus();
    window.location.reload(false);
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const { passwordOne, passwordTwo, error } = this.state;
 
    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';
  
    return (
      <Grid left columns={4}>
      <Grid.Column>
          <div class="customFont">Reset your Password below</div>
          <Form size="mini" onSubmit={this.onSubmit}>
            <Form.Input
              fluid
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="New Password"
            />
            <Form.Input
              fluid
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm New Password"
            />
            <Button disabled={isInvalid} color='blue' floated="right" size="mini" type="submit">
              Reset
            </Button>
    
            {error && <p>{error.message}</p>}
          </Form>
      </Grid.Column>
      </Grid>
    );
  }
}
 
export default withFirebase(PasswordChangeForm);