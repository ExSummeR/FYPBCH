import React, { Component } from 'react';
import { compose } from 'recompose';
import Moment from 'react-moment';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor'; 
import { Button, Form, Container, Segment } from 'semantic-ui-react';
import { Tabs } from "@feuer/react-tabs";
//import { selectFilter } from 'react-bootstrap-table2-filter';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const dateToFormat = new Date(); // e.g. Mon Apr 19 1976 09:59:00 GMT-0800
/*
const selectOptions = {
  0: 'good',
  1: 'Bad',
  2: 'unknown'
};
*/

const INITIAL_STATE = {
  faultID: '',
  faultDescription: '',
  faultCategory: '',
  faultOutlet: '',
  selectedRowIndex: '',

  feedbackID: '',
  feedbackCustomerName: '',
  feedbackCustomerEmail: '',
  feedbackOutlet: '',
  feedbackDescription: '',
  selectedRowIndexFeedback: '',

};

const columns = [{
  dataField: 'faultID',
  text: '# id',
  headerStyle: { backgroundColor: '#215E95', color: 'white'},
}, {
  dataField: 'dateSubmitted',
  text: 'Date',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'},
}, {
  dataField: 'faultCategory',
  text: 'Category',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'},
}, {
  dataField: 'faultOutlet',
  text: 'Outlet',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'},
}, {
  dataField: 'faultStatus',
  text: 'Status',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'},
  /*
  formatter: cell => selectOptions[cell],
  filter: selectFilter({
    options: selectOptions,
    defaultValue: 2
  })*/
}];

const columnsFeedback = [{
  dataField: 'feedbackID',
  text: '# id',
  headerStyle: { backgroundColor: '#215E95', color: 'white'},
}, {
  dataField: 'dateSubmitted',
  text: 'Date',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'},
}, {
  dataField: 'feedbackCustomerName',
  text: 'Customer Name',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'},
}, {
  dataField: 'feedbackCustomerEmail',
  text: 'Email (optional)',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'},
}, {
  dataField: 'feedbackOutlet',
  text: 'Outlet',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'},
}];

class HomePage extends Component {
  constructor(props) {
    super(props);
 
    this.state = { 
      ...INITIAL_STATE 
    };
  }
  
  writeData = (row) => {
    this.props.firebase.doUpdateSelectedFaultReport(row.faultID, row.faultCategory, row.faultDescription, row.faultOutlet, row.faultStatus);
  };

  onSubmit = event => {
    const { faultID, faultCategory, faultDescription, faultOutlet } = this.state;
    const dateSubmitted = (new Date()).toDateString();
    this.props.firebase.doCreateNewFaultReport(dateSubmitted, faultID, faultCategory, faultDescription, faultOutlet);
    this.setState({ ...INITIAL_STATE });
    event.preventDefault();
    window.location.reload(false);
  };

  onSubmitFeedback = event => {
    const { feedbackID, feedbackCustomerName, feedbackCustomerEmail, feedbackDescription, feedbackOutlet } = this.state;
    const dateSubmitted = (new Date()).toDateString();
    this.props.firebase.doCreateNewFeedback(dateSubmitted, feedbackID, feedbackCustomerName, feedbackCustomerEmail, feedbackDescription, feedbackOutlet);
    this.setState({ ...INITIAL_STATE });
    event.preventDefault();
    window.location.reload(false);
  };

  viewSelectedReport = (selectedRowIndex, faultReportObj) => {
    console.log("View Report for Row Index: ", selectedRowIndex);
    this.setState({selectedRowIndex:selectedRowIndex});
    if (selectedRowIndex === '') { // no report selected
      window.alert("No report selected. Please select a report from the table to view.");
    }
    else {
      this.props.history.push({
        pathname: ROUTES.REPORT_DETAILS_USER,
        state: { faultReport : faultReportObj }
      })
    }
  };

  viewSelectedFeedback = (selectedRowIndexFeedback, feedbackObj) => {
    console.log("View Feedback for Row Index: ", selectedRowIndexFeedback);
    this.setState({selectedRowIndexFeedback:selectedRowIndexFeedback});
    if (selectedRowIndexFeedback === '') { // no feedback selected
      window.alert("No feedback selected. Please select a feedback from the table to view.");
    }
    else {
      this.props.history.push({
        pathname: ROUTES.FEEDBACK_DETAILS_USER,
        state: { feedback : feedbackObj }
      })
    }
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeFeedback = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { faultID, faultCategory, faultDescription, faultOutlet } = this.state;
    const { feedbackID, feedbackCustomerName, feedbackCustomerEmail, feedbackDescription, feedbackOutlet } = this.state;

    const isInvalid = faultID === '' || faultCategory === '' || faultDescription === '' || faultOutlet === '';
    const isInvalidFeedback = feedbackID === '' || feedbackCustomerName === '' || feedbackDescription === '' || feedbackOutlet === '';

    var selectedRowIndex = '';
    var selectedRowIndexFeedback = '';

    const selectRow = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, e) => {
        console.log("Selected Table Row Index: ", rowIndex);
        selectedRowIndex = rowIndex;
      }
    };

    const selectRowFeedback = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, e) => {
        console.log("Selected Table Row Index: ", rowIndex);
        selectedRowIndexFeedback = rowIndex;
      }
    };

    return (
      <AuthUserContext.Consumer>
      {authUser => (
        <div>
          <Moment date={dateToFormat} />
          <h1>Home Page - Welcome {authUser.username}</h1>
          <p>The Home Page is accessible by every signed in EXISTING user.</p>
          <Tabs
            tabsProps={{
              style: {
                textAlign: "left",
                backgroundColor : "white",
              }
            }}
            activeTab={{
              id: "Fault"
            }}
          >
            <Tabs.Tab id="Fault" title="Fault">
              <p></p>
              <Form size="large" onSubmit={this.onSubmit}>
                <Form.Input
                  fluid
                  icon="hashtag"
                  iconPosition="left"
                  name="faultID"
                  value={faultID}
                  onChange={this.onChange}
                  type="number"
                  placeholder="Fault ID"
                />            
                <Form.Input
                  fluid
                  icon="question circle"
                  iconPosition="left"
                  name="faultCategory"
                  value={faultCategory}
                  onChange={this.onChange}
                  type="text"
                  placeholder="Fault Category"
                />
                <Form.Input
                  fluid
                  icon="question circle"
                  iconPosition="left"
                  name="faultDescription"
                  value={faultDescription}
                  onChange={this.onChange}
                  type="text"
                  placeholder="Fault Description"
                />
                <Form.Input
                  fluid
                  icon="map marker alternate"
                  iconPosition="left"
                  name="faultOutlet"
                  value={faultOutlet}
                  onChange={this.onChange}
                  placeholder="Fault Outlet"
                  type="text"
                />
                <Button disabled={isInvalid} color="blue" fluid size="large" type="submit">Submit a New Fault Report</Button>
              </Form>
              <p></p>
              <Segment>
              <BootstrapTable
                keyField="faultID"
                data={ (authUser.faultReports == null) ? [] : Object.keys(authUser.faultReports).map(key => ({
                  ...authUser.faultReports[key]
                })) }
                columns={ columns }
                selectRow={ selectRow }
                striped
                hover
                condensed
                cellEdit={ cellEditFactory({
                  mode: 'click',
                  onStartEdit: (row, column, rowIndex, columnIndex) => { console.log('start to edit!!!'); },
                  beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
                  afterSaveCell: (oldValue, newValue, row, column) => { console.log('After Saving Cell!!'); console.log(newValue, row); this.writeData(row); }
                }) }
              />
              <Button floated='right' positive size="small" type="click" onClick={()=>{this.viewSelectedReport(selectedRowIndex, 
                authUser.faultReports[String(selectedRowIndex)]);}}>View Selected Fault Report</Button>
              <div class="customFontBlack">Total number of Fault Reports: { authUser.faultReports == null ? 0 : (authUser.faultReports).length }</div>
              </Segment>
            </Tabs.Tab>

            <Tabs.Tab id="Feedback" title="Feedback">
              <p></p>
              <Form size="large" onSubmit={this.onSubmitFeedback}>
                <Form.Input
                  fluid
                  icon="hashtag"
                  iconPosition="left"
                  name="feedbackID"
                  value={feedbackID}
                  onChange={this.onChangeFeedback}
                  type="number"
                  placeholder="Feedback ID"
                />            
                <Form.Input
                  fluid
                  icon="question circle"
                  iconPosition="left"
                  name="feedbackCustomerName"
                  value={feedbackCustomerName}
                  onChange={this.onChangeFeedback}
                  type="text"
                  placeholder="Feedback Customer Name"
                />
                <Form.Input
                  fluid
                  icon="question circle"
                  iconPosition="left"
                  name="feedbackCustomerEmail"
                  value={feedbackCustomerEmail}
                  onChange={this.onChangeFeedback}
                  type="text"
                  placeholder="Feedback Customer Email"
                />
                <Form.Input
                  fluid
                  icon="map marker alternate"
                  iconPosition="left"
                  name="feedbackDescription"
                  value={feedbackDescription}
                  onChange={this.onChangeFeedback}
                  placeholder="Feedback Description"
                  type="text"
                />
                <Form.Input
                  fluid
                  icon="map marker alternate"
                  iconPosition="left"
                  name="feedbackOutlet"
                  value={feedbackOutlet}
                  onChange={this.onChangeFeedback}
                  placeholder="Feedback Outlet"
                  type="text"
                />
                <Button disabled={isInvalidFeedback} color="blue" fluid size="large" type="submit">Submit a Feedback</Button>
              </Form>
              <p></p>
              <Segment>
              <BootstrapTable
                keyField="feedbackID"
                data={ (authUser.feedback == null) ? [] : Object.keys(authUser.feedback).map(key => ({
                  ...authUser.feedback[key]
                })) }
                columns={ columnsFeedback }
                selectRow={ selectRowFeedback }
                striped
                hover
                condensed
                cellEdit={ cellEditFactory({
                  mode: 'click',
                  onStartEdit: (row, column, rowIndex, columnIndex) => { console.log('start to edit!!!'); },
                  beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
                  afterSaveCell: (oldValue, newValue, row, column) => { console.log('After Saving Cell!!'); console.log(newValue, row); this.writeDataFeedback(row); }
                }) }
              />
              <Button floated='right' positive size="small" type="click" onClick={()=>{this.viewSelectedFeedback(selectedRowIndexFeedback, 
                authUser.feedback[String(selectedRowIndexFeedback)]);}}>View Selected Feedback</Button>
              <div class="customFontBlack">Total number of Feedback: { authUser.feedback == null ? 0 : (authUser.feedback).length }</div>
              </Segment>
            </Tabs.Tab>
          </Tabs>
        </div>
      )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => authUser && !!authUser.isNewUser === false && !!authUser.roles[ROLES.USER];
 
export default compose(
  withAuthorization(condition),
  withFirebase,
)(HomePage);