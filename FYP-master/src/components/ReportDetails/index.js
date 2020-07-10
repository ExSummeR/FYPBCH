import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { Message } from 'semantic-ui-react';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

class ReportDetails extends Component {
    constructor(props) {
        super(props);
     
        this.state = { 
            faultOwner :  this.props.location.state.faultReport.faultOwner,
            faultOwnerName :  this.props.location.state.faultReport.faultOwnerName,
            assignedAdminUid :  this.props.location.state.faultReport.assignedAdminUid,
            isAssigned :  this.props.location.state.faultReport.isAssigned,
            faultCategory :  this.props.location.state.faultReport.faultCategory,
            faultOutlet :  this.props.location.state.faultReport.faultOutlet,
            faultDescription :  this.props.location.state.faultReport.faultDescription,
            faultStatus :  this.props.location.state.faultReport.faultStatus,
            faultUpdates :  this.props.location.state.faultReport.updates,
            updates : '',
            isResolved : false,
        };
    }

    deleteReport = (faultOwner, faultCategory, faultDescription, faultOutlet) => {
        this.props.firebase.doDeleteReport(faultOwner, faultCategory, faultDescription, faultOutlet);
        window.location.reload(false);
        this.props.history.push(ROUTES.ADMIN_HOME);
    };

    assignReport = (faultOwner, faultCategory, faultDescription, faultOutlet) => {
        this.props.firebase.doAssignSelectedFaultReport(faultOwner, faultCategory, faultDescription, faultOutlet);
        this.props.history.push(ROUTES.ADMIN_HOME);
    };

    updateSelectedFaultReport = (updates, faultOwner, faultCategory, faultDescription, faultOutlet) => {
        this.props.firebase.doUpdateSelectedFaultReportByAdmin(this.state.isResolved, updates, faultOwner, faultCategory, faultDescription, faultOutlet);
        this.setState({ updates : '', isResolved : false });
        this.props.history.push(ROUTES.ADMIN_HOME);
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
     
    onChangeCheckbox = event => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    render() {
        const faultOwner = this.state.faultOwner;
        const faultOwnerName = this.state.faultOwnerName;
        const assignedAdminUid = this.state.assignedAdminUid;
        const isAssigned = this.state.isAssigned;
        const faultCategory = this.state.faultCategory;
        const faultOutlet = this.state.faultOutlet;
        const faultDescription = this.state.faultDescription;
        const faultStatus = this.state.faultStatus;
        const faultUpdates = this.state.faultUpdates;

        var { updates, isResolved } = this.state;
        const isInvalidUpdate = updates === '';

        return (
        <AuthUserContext.Consumer>
        {authUser => (
        <div>
        <h1>Viewing Report...</h1>
        <p>Reported by Store Associate Username : { faultOwnerName } (uid : { faultOwner })</p>
        <p>Fault Category : { faultCategory }</p>
        <p>Fault Outlet : { faultOutlet }</p>
        <p>Fault Description : { faultDescription }</p>
        <p>Assigned Admin : { isAssigned ? assignedAdminUid : <span>(nil)</span> }</p>
        <Message>Updates From Admin : { faultUpdates }</Message>
        {
            assignedAdminUid === authUser.uid && (
            <Form size="small">
            <Form.Input
            fluid
            icon="edit"
            iconPosition="left"
            name="updates"
            value={updates}
            onChange={this.onChange}
            type="text"
            placeholder="Actions taken"
            />
            <Button disabled={isInvalidUpdate || faultStatus === 'RESOLVED'} floated='right' color="orange" size="small" type="click" onClick={()=>{this.updateSelectedFaultReport(this.state.updates,
            faultOwner, 
            faultCategory, 
            faultDescription, 
            faultOutlet);}}>Update Case</Button>
            <Button disabled={true} floated='right' positive size="small">Assigned to Me</Button>
            {faultStatus === 'RESOLVED' && (
            <Button floated='right' negative size="small" onClick={()=>{this.deleteReport(
            faultOwner, 
            faultCategory, 
            faultDescription, 
            faultOutlet);}}>Delete Report</Button>
            )}
            <label>
            Mark as Resolved:
            <input
                name="isResolved"
                type="checkbox"
                checked={isResolved}
                onChange={this.onChangeCheckbox}
            />
            </label>
            </Form>
        )}
        <p></p>
        {!isAssigned && (
            <Button floated='right' positive size="small" type="click" onClick={()=>{this.assignReport( 
            faultOwner, 
            faultCategory, 
            faultDescription, 
            faultOutlet);}}>Assign Case</Button>
        )}
        {isAssigned 
        && assignedAdminUid !== authUser.uid && (
            <Button disabled={true} floated='right' positive size="small" >Case taken by other Admin</Button>
        )}
        </div>
        )}
        </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];
 
export default compose(
  withAuthorization(condition),
  withFirebase,
)(ReportDetails);