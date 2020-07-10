import React, { Component } from 'react';
import { Button, Form, Grid } from 'semantic-ui-react';
import { withFirebase } from '../Firebase';
 
const INITIAL_STATE = {
  username: '',
  contactNumber: '',
};
 
class AccountDetailsChangeForm extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { username, contactNumber } = this.state;
    this.props.firebase.doUpdateAccountDetails(username, contactNumber);
    window.location.reload(false);
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const { username, contactNumber } = this.state;
 
    const isInvalid = username === '' || contactNumber === '';
  
    return (
      <Grid left columns={4}>
      <Grid.Column>
          <div class="customFont">Edit your contact number below</div>
          <Form size="mini" onSubmit={this.onSubmit}>
            <Form.Input
              fluid
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="New Username"
            />
            <Form.Input
              fluid
              name="contactNumber"
              value={contactNumber}
              onChange={this.onChange}
              type="text"
              placeholder="New Contact Number"
            />
            <Button disabled={isInvalid} color='blue' floated="right" size="mini" type="submit">
              Update
            </Button>
          </Form>
      </Grid.Column>
      </Grid>
    );
  }
}
 
export default withFirebase(AccountDetailsChangeForm);