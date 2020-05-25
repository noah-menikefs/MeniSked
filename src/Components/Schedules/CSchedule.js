import React from 'react';
import Calendar from './Calendar/Calendar';
import Button from 'react-bootstrap/button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import moment from 'moment';

import './Schedules.css';


const style = {
	position: "relative",
	margin: "10px auto"
}

class CSchedule extends React.Component{
	constructor(){
		super();
		this.state = {
			dateContext: moment(),
			today: moment(),
		}
	}

	onDayClick = (e,day) => {
		alert(day);
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

	setYear = (year) => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).set("year",year);
		this.setState({
			dateContext: dateContext
		})
	}

	onMonthChange = (event) => {
		this.setMonth(event.target.value);
		this.setState({month: event.target.value})
	}

	onYearChange = (event) => {
		this.setYear(event.target.value);
	}
	
	reset = () => {
		this.setState({dateContext: this.state.today});
	}



	render(){
		const {dateContext, today} = this.state;
		return(
			<div className="screen">
				<Row className="labels">
					<Col sm><h5 className="labels-child">Month</h5></Col>
					<Col sm><h5 className="labels-child">Year</h5></Col>
					<Col sm><Button onClick={this.reset} id="today" className="top-child" variant="primary">Today</Button></Col>
				</Row>
				<Row className="header">

				<Col sm><select value={dateContext.format('MMMM')} onChange={this.onMonthChange} className="top-child month selector">
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
					<Col sm><p className="vis top-child"></p></Col>

				</Row>
				<Row className="subheader">
					<Col sm>
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

			</div>
		);



	}


}

export default CSchedule;