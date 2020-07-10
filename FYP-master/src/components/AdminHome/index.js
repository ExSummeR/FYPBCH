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
  faultOwner: '',
  faultOwnerName: '',
  faultDescription: '',
  faultCategory: '',
  faultOutlet: '',
  updates: '',
  selectedRowIndex: '',

  feedbackID: '',
  feedbackCustomerName: '',
  feedbackCustomerEmail: '',
  feedbackOutlet: '',
  feedbackDescription: '',
  selectedRowIndexFeedback: '',

  isResolved: false,
  //numOfReports: '',
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
  headerStyle: { backgroundColor: '#215E95', color: 'white'}
}, {
  dataField: 'dateSubmitted',
  text: 'Date',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'}
}, {
  dataField: 'feedbackCustomerName',
  text: 'Customer Name',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'}
}, {
  dataField: 'feedbackCustomerEmail',
  text: 'Email (optional)',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'}
}, {
  dataField: 'feedbackOutlet',
  text: 'Outlet',
  editable: false,
  headerStyle: { backgroundColor: '#215E95', color: 'white'}
}];

class AdminHomePage extends Component {
  constructor(props) {
    super(props);
 
    this.state = { 
      ...INITIAL_STATE,
      loading: false,
      faultReportsArray: [],
      feedbackArray: [],
    };
  }
  
  componentDidMount() {
    this.setState({ loading: true });
 
    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      var faultNewIDCount = 0;
      var feedbackNewIDCount = 0;
      var tempFaultReportsArray = [];
      var tempFeedbackArray = [];
      for (var i=0; i<usersList.length; i++) {
        if (usersList[i].roles.hasOwnProperty("USER")) {
          if (usersList[i].hasOwnProperty("faultReports")) {
            for (var j=0; j<usersList[i].faultReports.length; j++) {
              usersList[i].faultReports[j].faultID = faultNewIDCount;
              usersList[i].faultReports[j].faultOwner = usersList[i].uid;
              usersList[i].faultReports[j].faultOwnerName = usersList[i].username;
              faultNewIDCount++;
              tempFaultReportsArray.push(usersList[i].faultReports[j]);
            }
          }
          if (usersList[i].hasOwnProperty("feedback")) {
            for (var k=0; k<usersList[i].feedback.length; k++) {
              usersList[i].feedback[k].feedbackID = feedbackNewIDCount;
              feedbackNewIDCount++;
              tempFeedbackArray.push(usersList[i].feedback[k]);
            }
          }
        }
      }

      console.log("Fault Report Array: ", tempFaultReportsArray);
      console.log("Feedback Array", tempFeedbackArray);
      console.log("UserList", usersList);
      
      this.setState({
        loading: false,
        faultReportsArray: tempFaultReportsArray,
        feedbackArray: tempFeedbackArray,
      });
    });
  }

  // Remove the listener to avoid memory leaks
  componentWillUnmount() {
    this.props.firebase.users().off();
  }
 
  writeData = (row) => {
    this.props.firebase.doUpdateSelectedFaultReport(row.faultID, row.faultCategory, row.faultDescription, row.faultOutlet, row.faultStatus);
  };

  viewSelectedReport = (selectedRowIndex) => {
    console.log("View Report for Row Index: ", selectedRowIndex);
    this.setState({selectedRowIndex:selectedRowIndex});
    if (selectedRowIndex === '') { // no report selected
      window.alert("No report selected. Please select a report from the table to view.");
    }
    else {
      this.props.history.push({
        pathname: ROUTES.REPORT_DETAILS,
        state: { faultReport : this.state.faultReportsArray[selectedRowIndex] }
      })
    }
  };

  assignReport = (selectedRowIndex, faultOwner, faultCategory, faultDescription, faultOutlet) => {
    console.log("Assigning Report for Row Index: ", selectedRowIndex);
    this.setState({selectedRowIndex:selectedRowIndex});
    if (selectedRowIndex === '') { // no report selected
      window.alert("No report selected. Please select a report from the table to view.");
    }
    else {
      this.props.firebase.doAssignSelectedFaultReport(faultOwner, faultCategory, faultDescription, faultOutlet);
    }
  };

  deleteReport = (selectedRowIndex, faultOwner, faultCategory, faultDescription, faultOutlet) => {
    console.log("Deleting Report for Row Index: ", selectedRowIndex);
    this.setState({selectedRowIndex:selectedRowIndex});
    if (selectedRowIndex === '') { // no feedback selected
      window.alert("No report selected. Please select a report from the table to delete.");
    }
    else {
      this.props.firebase.doDeleteReport(faultOwner, faultCategory, faultDescription, faultOutlet);
      window.location.reload(false);
    }
  };

  viewSelectedFeedback = (selectedRowIndexFeedback) => {
    console.log("View Feedback for Row Index: ", selectedRowIndexFeedback);
    this.setState({selectedRowIndexFeedback:selectedRowIndexFeedback});
    if (selectedRowIndexFeedback === '') { // no feedback selected
      window.alert("No feedback selected. Please select a feedback from the table to view.");
    }
    else {
      this.props.history.push({
        pathname: ROUTES.FEEDBACK_DETAILS,
        state: { feedback : this.state.feedbackArray[selectedRowIndexFeedback] }
      })    
    }
  };

  deleteSelectedFeedback = (selectedRowIndexFeedback, feedbackCustomerName, feedbackCustomerEmail, feedbackDescription, feedbackOutlet) => {
    console.log("Deleting Feedback for Row Index: ", selectedRowIndexFeedback);
    this.setState({selectedRowIndexFeedback:selectedRowIndexFeedback});
    if (selectedRowIndexFeedback === '') { // no feedback selected
      window.alert("No feedback selected. Please select a feedback from the table to delete.");
    }
    else {
      this.props.firebase.doDeleteFeedback(feedbackCustomerName, feedbackCustomerEmail, feedbackDescription, feedbackOutlet);
      window.location.reload(false);
    }
  };

  updateSelectedFaultReport = (updates, faultOwner, faultCategory, faultDescription, faultOutlet) => {
    this.props.firebase.doUpdateSelectedFaultReportByAdmin(this.state.isResolved, updates, faultOwner, faultCategory, faultDescription, faultOutlet);
    this.setState({ updates : '', isResolved : false });
    //window.location.reload(false);
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    var { faultOwner, faultDescription, updates, isResolved } = this.state;
    var { feedbackCustomerName, feedbackCustomerEmail, feedbackDescription, feedbackOutlet } = this.state;
    const { loading, faultReportsArray, feedbackArray } = this.state;

    const isInvalidUpdate = updates === '';

    var selectedRowIndex = '';
    var selectedRowIndexFeedback = '';

    const selectRow = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, e) => {
        console.log("Selected Table Row Index: ", rowIndex);
        selectedRowIndex = rowIndex;
        //faultOwnerName = faultReportsArray[rowIndex].faultOwnerName;
        faultOwner = faultReportsArray[rowIndex].faultOwner;
        //faultCategory = faultReportsArray[rowIndex].faultCategory;
        faultDescription = faultReportsArray[rowIndex].faultDescription;
        //faultOutlet = faultReportsArray[rowIndex].faultOutlet;
        console.log(faultOwner + " " + faultDescription);
      }
    };

    const selectRowFeedback = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, e) => {
        console.log("Selected Table Row Index: ", rowIndex);
        selectedRowIndexFeedback = rowIndex;
        feedbackCustomerName = feedbackArray[rowIndex].feedbackCustomerName;
        feedbackCustomerEmail = feedbackArray[rowIndex].feedbackCustomerEmail;
        feedbackDescription = feedbackArray[rowIndex].feedbackDescription;
        feedbackOutlet = feedbackArray[rowIndex].feedbackOutlet;
        console.log(feedbackCustomerName);
      }
    };

    return (
      <div>
      <AuthUserContext.Consumer>
      {authUser => (
        <div>
        <Moment format="ddd D MMM YYYY" date={dateToFormat} />
        <h1>Admin Home Page - Welcome {authUser.username} </h1>
        <p>The Admin Home Page is accessible by every signed in ADMIN user. No creation of fault report or feedback allowed. Only reviews.</p>
        {loading && <div>Loading ...</div>}
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

          <Tabs.Tab id="Fault" title="Fault" >
            <p></p>
            <Segment>
            <BootstrapTable
              keyField="faultID"
              data={ faultReportsArray }
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
            <Button floated='right' color="blue" size="small" type="click" onClick={()=>{this.viewSelectedReport(selectedRowIndex);}}>View Selected Fault Report</Button>
            <div class="customFontBlack">Total number of Fault Reports: { faultReportsArray.length }</div>
            </Segment>
          </Tabs.Tab>

          <Tabs.Tab id="Feedback" title="Feedback">
            <p></p>
            <Segment>
            <BootstrapTable
              keyField="feedbackID"
              data={ feedbackArray }
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
            <Button floated='right' color="red" size="small" type="click" 
              onClick={()=>{this.deleteSelectedFeedback(selectedRowIndexFeedback, 
                            feedbackCustomerName,
                            feedbackCustomerEmail,
                            feedbackDescription,
                            feedbackOutlet);}}>Delete Selected Feedback</Button>
            <Button floated='right' color="blue" size="small" type="click" onClick={()=>{this.viewSelectedFeedback(selectedRowIndexFeedback);}}>View Selected Feedback</Button>
            <div class="customFontBlack">Total number of Feedback: { feedbackArray.length }</div>
            </Segment>
          </Tabs.Tab>
        </Tabs>
        </div>
      )}
      </AuthUserContext.Consumer>
      </div>
    );
  }
}

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];
 
export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminHomePage);