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

class PubSchedule extends React.Component{
	constructor(){
		super();
		this.state = {
			allNotes: [],
			vNotes: [],
			show: false,
			dateContext: moment(),
			note: '',
			radio: 0,
			rHolidayList: [],
			nrHolidayList: [],
			holiDays: [],
			render: false
		}
	}

	componentDidMount = () => {
   		this.loadAllNotes();
   		this.loadrHolidays();
   		this.loadnrHolidays();
  	}

  	loadAllNotes = () => {
    	fetch('http://localhost:3000/sked/allNotes')
      		.then(response => response.json())
      		.then(notes => this.setState({
      			allNotes: notes,
      			vNotes: notes.filter((note => note.type === 2))
      		}));

  	}

  	loadrHolidays = () => {
		fetch('http://localhost:3000/holiday/r')
			.then(response => response.json())
			.then(holidays => this.setState({rHolidayList: holidays.filter((holiday => holiday.isActive === true))}));
	}

	loadnrHolidays = () => {
		fetch('http://localhost:3000/holiday/nr')
			.then(response => response.json())
			.then(holidays => this.setState({nrHolidayList: holidays}));
	}

	loadNewDays = (dateContext) => {
		let newArr = [];
		this.state.nrHolidayList.forEach((nholiday => {
			nholiday.eventSked.forEach((date => {
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
		this.setState({show: !this.state.show});
	}

	onDoubleClick = (e,day) => {
		this.alert(day);
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
		this.setState({month: event.target.value});
	}

	onYearChange = (event) => {
		this.setYear(event.target.value);
	}

	noteRadioChange = (event) => {
		this.setState({radio: event.target.id});
	}

	onNotesSubmit = () => {
		if (this.state.note.length > 0 && this.state.radio > 0){
			fetch('http://localhost:3000/sked/notes', {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					date: this.state.dateContext.format("MM/DD/YYYY"),
					type: parseInt(this.state.radio,10),
					msg: this.state.note

				})
			})
			.then(response => response.json())
			.then(note => {
				if (note.id){
					this.loadAllNotes();
				}
			})
			this.setState({
				radio:0,
				note:''
			})
			this.toggleShow();
		}
		
	}

	onNoteChange = (event) => {
		this.setState({note: event.target.value})
	}
	
	reset = () => {
		this.setState({dateContext: this.props.today});
		this.loadNewDays(this.props.today);
	}

	
	yearSelect = () => {
		let arr = [];
		let fYear = this.props.today.year();
		for (let i = 2020; i <= fYear + 10; i++){
			arr.push(<option key={i} value={i}>{i}</option>)
		}
		return arr;
	}

	adminSelect(isAdmin, user){
		if (isAdmin){
			return (
				<div>
				<Row className="labels">
					<Col sm><h5 className="labels-child">Month</h5></Col>
					<Col sm><h5 className="labels-child">Year</h5></Col>
					<Col sm><Button onClick={() => console.log('click')} className="top-child" variant="primary">Publish</Button></Col>
					<Col sm><Button onClick={this.reset} id="today" className="top-child" variant="primary">Today</Button></Col>
				</Row>
				<Row>
					<Col sm><select value={this.state.dateContext.format('MMMM')} onChange={this.onMonthChange} className="top-child month selector">
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
					<Col ><select value={this.state.dateContext.format('Y')} onChange={this.onYearChange} className="top-child year selector">
	  					{this.yearSelect()}
					</select></Col>
					<Col ><p></p></Col>
					<Col ><p></p></Col>
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
					<Col >
						<p></p>
					</Col>
					<Col >
						<p></p>
					</Col>
				</Row>
				</div>
			);
		}
	}

	adminNotes = () => {
		if (this.props.testIsAdmin === true){
			return (
				<Form>
					<hr/>
        			<Form.Group>
        				<Form.Control onChange={this.onNoteChange} id="note-text" size="sm" type="text" placeholder="Add Note"/>
        			</Form.Group>
        			<Form.Label id="typeON">Type of Note:</Form.Label>
        			<Form.Group onChange={this.noteRadioChange}>
      					<Form.Check name="noteType" inline label="Numbers" type="radio" id='1'/>
     					<Form.Check inline name="noteType" label="Visible" type="radio" id='2'/>
     					<Form.Check inline name="noteType" label="Invisible" type="radio" id='3'/>
        			</Form.Group>
       				<Form.Group>
     					<Button onClick={this.onNotesSubmit} size="sm" variant="primary">Submit Note</Button>
   					</Form.Group>
  				</Form>
			)
		}
	}

	render(){
		const {show, dateContext, allNotes, vNotes, nrHolidayList, render, holiDays} = this.state;
		const {testIsAdmin, user, today} = this.props;
		return(
			<div className="screen">
				<div>
					{this.adminSelect(testIsAdmin, user)}
				</div>
				<Row className="curr">
					<Col xl><h2>{dateContext.format('MMMM')+' '+dateContext.format('Y')}</h2></Col>
				</Row>
				<div className="sked">
					{ (nrHolidayList.length > 0 && !render)
						?this.loadNewDays(this.props.today)
						: false
					}
					<Calendar holiDays={holiDays} onDoubleClick={this.onDoubleClick} type="Published" dateContext={dateContext} today={today} style={style} onDayClick={(e,day) => this.onDayClick(e,day)}/>
				</div>
				<div className="bottom">
					<Col ><Button variant="primary">Download as PDF</Button></Col>
				</div>

				<div className='modal'>
					<Modal show={show} onHide={this.toggleShow} >
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>{dateContext.format("MMMM DD, YYYY")}</Modal.Title>
       	 				</Modal.Header>
        				<Modal.Body>
        					<ul className="">
        						<li>Canada Day</li>
        						<li>1st call day Abbass</li>
        						<li>1st call night Ahn</li>
        						<li>2nd call Holt</li>
        						<li>Vacation Arat</li>
        						<li>Request no call Menikefs</li>
        						<li>No assignment Ismail</li>
        					</ul>
        				 {this.adminNotes()}
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

export default PubSchedule;