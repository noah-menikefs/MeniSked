import React from 'react';
import Calendar from './Calendar/Calendar';
import Button from 'react-bootstrap/button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyDocument from './../PDF/MyDocument'
import Modal from 'react-bootstrap/Modal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import moment from 'moment';

import './Schedules.css';


const style = {
	position: "relative",
	margin: "10px auto",
	width: "90%"
}

class CSchedule extends React.Component{
	constructor(){
		super();
		this.state = {
			dateContext: moment(),
			show: false,
			holiDays: [],
			rHolidayList: [],
			nrHolidayList: [],
			render: false,
			callSked:[],
			callList: [],
			day: -1
		}
	}

	componentDidMount = () => {
   		this.loadrHolidays();
   		this.loadnrHolidays();
   		this.loadCallTypes();
   		this.loadCallSked();
  	}

  	loadCallSked = () => {
    	fetch('http://localhost:3000/people')
      		.then(response => response.json())
      		.then(docs => {
      			let arr = [];
      			let callIds = [];
      			for (let n = 0; n < this.state.callList.length; n++){
      				callIds.push(this.state.callList[n].id);
      			}
      			for (let i = 0; i < docs.length; i++){
      				for (let j = 0; j < docs[i].worksked.length; j++){
      					for (let m = 0; m < callIds.length; m++){
      						if (docs[i].worksked[j].id === callIds[m]){
      							arr.push({
	      							id: docs[i].worksked[j].id,
	      							date: docs[i].worksked[j].date,
	      							name: docs[i].lastname,
	      							colour: docs[i].colour,
	      							priority: this.priorityCheck(docs[i].worksked[j].id)
      							})
      						}
      					}
      				}
      			}
      			arr.sort(function(a, b){return a.priority - b.priority})
      			this.setState({callSked: arr})
      		});
  	}

  	priorityCheck = (id) => {
		for (let n = 0; n < this.state.callList.length; n++){
			if (this.state.callList[n].id === id){
				return this.state.callList[n].priority;
			}
		}
  	}


	loadrHolidays = () => {
		fetch('http://localhost:3000/holiday/r')
			.then(response => response.json())
			.then(holidays => this.setState({rHolidayList: holidays.filter((holiday => holiday.isactive === true))}));
	}

	loadnrHolidays = () => {
		fetch('http://localhost:3000/holiday/nr')
			.then(response => response.json())
			.then(holidays => this.setState({nrHolidayList: holidays}));
	}

	loadCallTypes = () => {
		fetch('http://localhost:3000/callTypes')
			.then(response => response.json())
			.then(calls => this.setState({callList: calls.sort(function(a, b){return a.priority - b.priority})}));
	}

	loadNewDays = (dateContext) => {
		let newArr = [];
		this.state.nrHolidayList.forEach((nholiday => {
			nholiday.eventsked.forEach((date => {
				let dateArr = date.split("/");
				if (dateArr[0] === dateContext.format('MM') && dateArr[2] === dateContext.format('YYYY')){
					newArr.push({
						day: parseInt(dateArr[1],10),
						name: nholiday.name
					});
				}
			}))
		}))

		this.state.rHolidayList.forEach((holiday => {
			if (holiday.month === dateContext.format('MMMM')){
				newArr.push({
					day:holiday.day,
					name: holiday.name
				});
			}
		}))
		this.setState({
			holiDays: newArr,
			render: true}
		);
	}

	onDayClick = (e,day) => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).set("date", day);
		this.setState({
			dateContext: dateContext,
		});
		this.toggleShow(day);
	}

	toggleShow = (day) => {
		this.setState({
			show: !this.state.show,
			day: day
		});
	}

	onDoubleClick = (e,day) => {
		console.log('YEEEEE');
	}

	months = moment.months(); // List of each month

	setMonth = (month) => {
		let monthNo = this.months.indexOf(month);
		let dateContext = Object.assign({}, this.state.dateContext)
		dateContext = moment(dateContext).set("month", monthNo);
		this.setState({
			dateContext: dateContext,
		});
		this.loadNewDays(dateContext);
	}

	nextMonth = () => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).add(1, "month");
		if (dateContext.year() <= (this.props.today.year() + 10)){
			this.setState({
				dateContext: dateContext,
			});
			this.loadNewDays(dateContext);
			this.props.onNextMonth && this.props.onNextMonth();
		}
	}

	prevMonth = () => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).subtract(1, "month");
		if (dateContext.year() >= 2020){
			this.setState({
				dateContext: dateContext,
			});
			this.loadNewDays(dateContext);
			this.props.onPrevMonth && this.props.onPrevMonth();
		}
	}

	nextYear = () => {
		if ((this.state.dateContext.year() + 1) <= (this.props.today.year() + 10)){
			let dateContext = Object.assign({}, this.state.dateContext);
			dateContext = moment(dateContext).add(1, "year");
			this.setState({
				dateContext: dateContext
			});
			this.loadNewDays(dateContext);
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
			this.loadNewDays(dateContext);
			this.props.onPrevYear && this.props.onPrevYear();
		}
	}

	setYear = (year) => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).set("year",year);
		this.setState({
			dateContext: dateContext
		})
		this.loadNewDays(dateContext);
	}

	onMonthChange = (event) => {
		this.setMonth(event.target.value);
		this.setState({month: event.target.value})
	}

	onYearChange = (event) => {
		this.setYear(event.target.value);
	}
	
	reset = () => {
		this.setState({dateContext: this.props.today});
		this.loadNewDays(this.props.today);
	}


	idToName = (id) => {
		for (let n = 0; n < this.state.callList.length; n++){
			if (this.state.callList[n].id === id){
				return this.state.callList[n].name;
			}
		}
	}

	render(){
		const {dateContext, show, holiDays, nrHolidayList, render, callSked, callList, day} = this.state;
		const {today, user} = this.props;
		let yearSelect = [];

		let fYear = today.year();

		for (let i = 2020; i <= fYear + 10; i++){
			yearSelect.push(<option key={i} value={i}>{i}</option>)
		}

		let modalList = [];
		for (let i = 0; i < callSked.length; i++){
			const splitArr = callSked[i].date.split('/');
			if (splitArr[0] === dateContext.format('MM') && parseInt(splitArr[1],10) === day && splitArr[2] === dateContext.format('YYYY')){
				modalList.push(<li key={-i-1}>{this.idToName(callSked[i].id) + ' '}<span style={{'backgroundColor':callSked[i].colour}}>{callSked[i].name}</span></li>);
			}
		}

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
	  					{yearSelect}
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
					{ (nrHolidayList.length > 0 && !render)
						?this.loadNewDays(this.props.today)
						: false
					}
					<Calendar callList={callList} callSked={callSked} holiDays={holiDays} onDoubleClick={(e,day) => this.onDoubleClick(e,day)} type="Call" dateContext={dateContext} today={today} style={style} onDayClick={(e,day) => this.onDayClick(e,day)}/>
				</div>
				<div className="bottom">
					{/*<Col ><Button onClick={this.createPDF} variant="primary">Download as PDF</Button></Col>*/}
					<Col><PDFDownloadLink document={<MyDocument entries={[]} callList={callList} callSked={callSked} holiDays={holiDays} type="Call" dateContext={dateContext} user={user}/>} fileName={dateContext.format('MMMM')+dateContext.format('Y')+'callsked.pdf'}>
      					{({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download as PDF')}
    				</PDFDownloadLink></Col>
				</div>
				<div className='modal'>
					<Modal show={show} onHide={this.toggleShow} >
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>{dateContext.format("MMMM DD, YYYY")}</Modal.Title>
       	 				</Modal.Header>
        				<Modal.Body>
        					<ul>
        						{modalList}
        					</ul>
        				</Modal.Body>
        				<Modal.Footer>
          					<Button variant="secondary" onClick={this.toggleShow}>
            					Close
          					</Button>
	        			</Modal.Footer>
      				</Modal>
				</div>

			</div>
		);



	}


}

export default CSchedule;