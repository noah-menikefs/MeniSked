import React from 'react';
import Calendar from './Calendar/Calendar';
import Button from 'react-bootstrap/button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import moment from 'moment';


import './Schedules.css';

const style = {
	position: "relative",
	margin: "10px auto"
}


class PerSchedule extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			physician: 'Ismail',
			entry: 'Request No Call',
			show: false,
			dateContext: moment(),
			today: moment(),
			showMonthPopup: false,
			showYearPopup: false
		}
	}

	onDayClick = (e,day) => {
		console.log(this.state.entry);
		if (this.state.entry === "Assign Call Type"){
			this.toggleShow();
		}
	}

	weekdays = moment.weekdays(); //List of weekdays
	weekdaysShort = moment.weekdaysShort(); //List of shortened days
	months = moment.months(); // List of each month

	setMonth = (month) => {
		let monthNo = this.months.indexOf(month);
		let dateContext = Object.assign({}, this.state.dateContext)
		dateContext = moment(dateContext).set("month", monthNo);
		this.setState({
			dateContext: dateContext,
		});
	}

	nextMonth = () => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).add(1, "month");
		this.setState({
			dateContext: dateContext,
		});
		this.props.onNextMonth && this.props.onNextMonth();
	}

	prevMonth = () => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).subtract(1, "month");
		this.setState({
			dateContext: dateContext,
		});
		this.props.onPrevMonth && this.props.onPrevMonth();
	}

	nextYear = () => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).add(1, "year");
		this.setState({
			dateContext: dateContext
		});
		this.props.onNextYear && this.props.onNextYear();
	}

	prevYear = () => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).subtract(1, "year");
		this.setState({
			dateContext: dateContext
		});
		this.props.onPrevYear && this.props.onPrevYear();
	}

	onSelectChange = (e, data) => {
		this.setMonth(data);
		this.props.onMonthChange && this.props.onMonthChange();

	}

	setYear = (year) => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).set("year",year);
		this.setState({
			dateContext: dateContext
		})
	}

	year = () => {
		return this.state.dateContext.format('Y');
	}
	month = () => {
		return this.state.dateContext.format('MMMM');
	}

	onPhysicianChange = (event) => {
		this.setState({physician: event.target.value})
	}

	onEntryChange = (event) => {
		this.setState({entry: event.target.value})
	}

	onMonthChange = (event) => {
		this.setMonth(event.target.value);
		this.setState({month: event.target.value})
	}

	onYearChange = (event) => {
		this.setYear(event.target.value);
	}

	toggleShow = () => {
		this.setState({show: !this.state.show})
	}


	adminSelect(isAdmin, user){
		if (isAdmin){
			return (
				<select value={this.state.physician} onChange={this.onPhysicianChange} className="top-child doc selector">
  					<option value="Ismail">Ismail</option>
  					<option value="Menikefs">Menikefs</option>
  					<option value="Miskew">Miskew</option>
 				 	<option value="Weiss">Weiss</option>
				</select>
			);
		}
		else{
			return (
				<h6 className="top-child">{user.lastName}</h6>
			);
		}
	}

	adminButton = (isAdmin) => {
		if (isAdmin){
			<Button className="arrow top-child" variant="secondary">&#9668;</Button>
			<Button className="arrow top-child" variant="secondary">&#9658;</Button>
		}
		else{
			<p className="vis top-child"></p>
		}
	}

	reset = () => {
		this.setState({dateContext: this.state.today});
	}


	render(){
		const {show, dateContext, today} = this.state;
		const {testIsAdmin, user} = this.props;
		return(
			<div className="screen">
				<Row className="labels">
					<Col sm><h5 className="labels-child">Physician</h5></Col>
					<Col sm><h5 className="labels-child">Type of Entry</h5></Col>
					<Col sm><h5 className="labels-child">Month</h5></Col>
					<Col sm><h5 className="labels-child">Year</h5></Col>
					<Col ><Button onClick={this.reset} id="today" className="top-child"variant="primary">Today</Button></Col>
				</Row>
				<Row className="header">
					<Col >{this.adminSelect(testIsAdmin, user)}</Col>
					<Col ><select onChange={this.onEntryChange} className="top-child types selector">
	  					<option value="Request No Call" selected>Request No Call</option>
	  					<option value="Vacation">Vacation</option>
	  					<option value="Assign Call Type">Assign Call Type</option>
					</select></Col>
					<Col ><select value={dateContext.format('MMMM')} onChange={this.onMonthChange} className="top-child month selector">
	  					<option value="January">January</option>
	  					<option value="February">February</option>
	  					<option value="March">March</option>
	  					<option value="April">April</option>
	  					<option value="May">May</option>
	  					<option value="June">June</option>
	  					<option value="July">July</option>
	  					<option value="August">August</option>
	  					<option value="September">September</option>
	  					<option value="October">October</option>
	  					<option value="November">November</option>
	  					<option value="December">December</option>
					</select></Col>
					<Col ><select value={dateContext.format('Y')} onChange={this.onYearChange} className="top-child year selector">
	  					<option value="2020">2020</option>
	  					<option value="2021">2021</option>
	  					<option value="2022">2022</option>
					</select></Col>
					<Col sm><p className="vis labels-child"></p></Col>
				</Row>
				<Row className="subheader">
					<Col sm>
						
					</Col>
					<Col sm>
						<Button className="arrow top-child"variant="secondary">&#9668;</Button>
						<Button className="arrow top-child"variant="secondary">&#9658;</Button>
					</Col>
					<Col >
						<Button onClick={this.prevMonth} className="arrow top-child"variant="secondary">&#9668;</Button>
						<Button onClick={this.nextMonth} className="arrow top-child"variant="secondary">&#9658;</Button>
					</Col>
					<Col sm>
						<Button onClick={this.prevYear} className="arrow top-child"variant="secondary">&#9668;</Button>
						<Button onClick={this.nextYear} className="arrow top-child"variant="secondary">&#9658;</Button>
					</Col>
					<Col sm>
						<p className="vis top-child"></p>
					</Col>
				</Row>
				<Row className="curr">
					<Col xl><h3>{dateContext.format('MMMM')+' '+dateContext.format('Y')}</h3></Col>
				</Row>
				<div className="sked">
					<Calendar dateContext={dateContext} today={today} style={style} width="90%" onDayClick={(e,day) => this.onDayClick(e,day)}/>
				</div>
				<div className="bottom">
					<Col ><Button variant="primary">Download as PDF</Button></Col>
				</div>

				<div className='modal'>
					<Modal show={show} onHide={this.toggleShow} onSubmit={this.toggleShow}>
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>Select Call Type</Modal.Title>
       	 				</Modal.Header>
        				<Form>
        					<Modal.Body>
        					<Form.Group controlId="formBasicRadio">
      							<Form.Check required name="callType" type='radio' id={1} label={"1st Call Day"}/>
      							<Form.Check name="callType" type='radio' id={2} label={"1st Call Night"}/>
      							<Form.Check name="callType" type='radio' id={3} label={"1st Call"}/>
      							<Form.Check name="callType" type='radio' id={4} label={"2nd Call Day"}/>
      							<Form.Check name="callType" type='radio' id={5} label={"2nd Call Night"}/>
      							<Form.Check name="callType" type='radio' id={6} label={"2nd Call"}/>
      							<Form.Check name="callType" type='radio' id={7} label={"COVID am"}/>
      							<Form.Check name="callType" type='radio' id={8} label={"COVID pm"}/>
      							<Form.Check name="callType" type='radio' id={9} label={"COVID x 24"}/>
  							</Form.Group>
        				</Modal.Body>
        				<Modal.Footer>
          					<Button onClick={this.toggleShow} variant="secondary" >
            					Close
          					</Button>
          					 <Button type="submit" variant="primary" >
            					Submit
          					</Button>
	        			</Modal.Footer>
	        			</Form>
      				</Modal>
				</div>

			</div>
		);



	}


}

export default PerSchedule;