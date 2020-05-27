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
	margin: "10px auto",
	width: "90%"
}


class PerSchedule extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			physician: this.props.docs[0],
			entry: this.props.entries[0],
			show: false,
			dateContext: moment()
		}
	}

	onDayClick = (e,day) => {
		if (this.state.entry === "Assign Call Type"){
			this.toggleShow();
		}
	}

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

	nextDoc = () => {
		let newIndex = 0;
		let index = this.props.docs.indexOf(this.state.physician);
		if (index !== (this.props.docs.length - 1)){
			newIndex = index + 1;

		}
		this.setState({physician: this.props.docs[newIndex]});
	}
	prevDoc =() => {
		let newIndex = this.props.docs.length-1;
		let index = this.props.docs.indexOf(this.state.physician);
		if (index !== 0){
			newIndex = index - 1;

		}
		this.setState({physician: this.props.docs[newIndex]});
	}
	nextEntry = () => {
		let newIndex = 0;
		let index = this.props.entries.indexOf(this.state.entry);
		if (index !== (this.props.entries.length - 1)){
			newIndex = index + 1;

		}
		this.setState({entry: this.props.entries[newIndex]});
	}

	prevEntry =() => {
	let newIndex = this.props.entries.length-1;
		let index = this.props.entries.indexOf(this.state.entry);
		if (index !== 0){
			newIndex = index - 1;

		}
		this.setState({entry: this.props.entries[newIndex]});
	}

	nextYear = () => {
		if ((this.state.dateContext.year() + 1) <= (this.props.today.year() + 10)){
			let dateContext = Object.assign({}, this.state.dateContext);
			dateContext = moment(dateContext).add(1, "year");
			this.setState({
				dateContext: dateContext
			});
			this.props.onNextYear && this.props.onNextYear();
		}
	}

	prevYear = () => {
		if ((this.state.dateContext.year() - 1) >= 2020) {
			let dateContext = Object.assign({}, this.state.dateContext);
			dateContext = moment(dateContext).subtract(1, "year");
			this.setState({
				dateContext: dateContext
			});
			this.props.onPrevYear && this.props.onPrevYear();
		}
	}

	setYear = (year) => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).set("year",year);
		this.setState({
			dateContext: dateContext
		})
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

	adminButton = (isAdmin) => {
		if (isAdmin){
			return (
			<div>
				<Button onClick={this.prevDoc} className="arrow top-child" variant="secondary">&#9668;</Button>
				<Button onClick={this.nextDoc} className="arrow top-child" variant="secondary">&#9658;</Button>
			</div>
			);
		}
		else{
			return <p className="vis top-child"></p>
		}
	}

	reset = () => {
		this.setState({dateContext: this.props.today});
	}


	render(){
		const {show, dateContext} = this.state;
		const {testIsAdmin, user, today} = this.props;

		let docSelect = this.props.docs.map((doc) => {
		return <option key={doc} value={doc}>{doc}</option>
		})

		let adminSelect = (isAdmin, user) => {
			if (isAdmin){
				return (
					<select value={this.state.physician} onChange={this.onPhysicianChange} className="top-child doc selector">
  						{docSelect}
					</select>
				);
			}
			else{
				return (
					<h6 className="top-child">{user.lastName}</h6>
				);
			}
		}

		let entrySelect = this.props.entries.map((entry) => {
			return <option key={entry} value={entry}>{entry}</option>
		})

		let yearSelect = [];

		let fYear = today.year();

		for (let i = 2020; i <= fYear + 10; i++){
			yearSelect.push(<option key={i} value={i}>{i}</option>)
		}


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
					<Col >{adminSelect(testIsAdmin, user)}</Col>
					<Col ><select value={this.state.entry} onChange={this.onEntryChange} className="top-child types selector">
						{entrySelect}
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
					{yearSelect}
					</select></Col>
					<Col sm><p className="vis labels-child"></p></Col>
				</Row>
				<Row className="subheader">
					<Col sm>
						{this.adminButton(testIsAdmin)}
					</Col>
					<Col sm>
						<Button onClick={this.prevEntry} className="arrow top-child"variant="secondary">&#9668;</Button>
						<Button onClick={this.nextEntry} className="arrow top-child"variant="secondary">&#9658;</Button>
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
					<Calendar type="Personal" dateContext={dateContext} today={today} style={style} onDayClick={(e,day) => this.onDayClick(e,day)}/>
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