import React, { Component } from 'react';
import { compose } from 'recompose';
import { Message } from 'semantic-ui-react';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

class ReportDetailsUser extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
            assignedAdminUid :  this.props.location.state.faultReport.assignedAdminUid,
            isAssigned :  this.props.location.state.faultReport.isAssigned,
            faultCategory :  this.props.location.state.faultReport.faultCategory,
            faultOutlet :  this.props.location.state.faultReport.faultOutlet,
            faultDescription :  this.props.location.state.faultReport.faultDescription,
            faultUpdates :  this.props.location.state.faultReport.updates,
            faultStatus :  this.props.location.state.faultReport.faultStatus,
        };
    }

    render() {
        const assignedAdminUid = this.state.assignedAdminUid;
        const isAssigned = this.state.isAssigned;
        const faultCategory = this.state.faultCategory;
        const faultOutlet = this.state.faultOutlet;
        const faultDescription = this.state.faultDescription;
        const faultUpdates = this.state.faultUpdates;
        const faultStatus = this.state.faultStatus;

        return (
        <div>
        <h1>Viewing Report...</h1>
        <p>Fault Status : { faultStatus }</p>
        <p>Fault Category : { faultCategory }</p>
        <p>Fault Outlet : { faultOutlet }</p>
        <p>Fault Description : { faultDescription }</p>
        <p>Assigned Admin : { isAssigned ? assignedAdminUid : <span>(nil)</span> }</p>
        <Message>Updates From Admin : { faultUpdates }</Message>
        </div>
        );
    }
}

const condition = authUser => authUser && !!authUser.roles[ROLES.USER];
 
export default compose(
  withAuthorization(condition),
  withFirebase,
)(ReportDetailsUser);