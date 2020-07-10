import React, { Component } from 'react';
import { compose } from 'recompose';
import { Message } from 'semantic-ui-react';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

class FeedbackDetails extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
            feedbackCustomerName :  this.props.location.state.feedback.feedbackCustomerName,
            feedbackCustomerEmail :  this.props.location.state.feedback.feedbackCustomerEmail,
            feedbackDescription :  this.props.location.state.feedback.feedbackDescription,
            feedbackOutlet :  this.props.location.state.feedback.feedbackOutlet,
        };
    }

    render() {
        const feedbackCustomerName = this.state.feedbackCustomerName;
        const feedbackCustomerEmail = this.state.feedbackCustomerEmail;
        const feedbackDescription = this.state.feedbackDescription;
        const feedbackOutlet = this.state.feedbackOutlet;

        return (
        <div>
        <h1>Viewing Feedback...</h1>
        <p>Feedback Customer Name: { feedbackCustomerName }</p>
        <p>Feedback Customer Email: { feedbackCustomerEmail }</p>
        <p>Feedback Outlet : { feedbackOutlet }</p>
        <Message>Feedback Description : { feedbackDescription }</Message>
        </div>
        );
    }
}

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];
 
export default compose(
  withAuthorization(condition),
  withFirebase,
)(FeedbackDetails);