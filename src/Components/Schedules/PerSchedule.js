import React from 'react';
import Calendar from './Calendar/Calendar';
import MyDocument from './../PDF/MyDocument'
import Button from 'react-bootstrap/button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { PDFDownloadLink } from '@react-pdf/renderer';
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
			activeDocs: [],
			entries: [],
			docIndex: 0,
			entryIndex: 0,
			show: false,
			dateContext: moment(),
			callList: [],
			radio: -1,
			day: 0,
			rHolidayList: [],
			nrHolidayList: [],
			holiDays: [],
			personalDays: [],
			render: false
		}
	}

	componentDidMount = () => {
   		this.loadActiveDocs();
   		this.loadEntries();
   		this.loadCallTypes();
   		this.loadrHolidays();
   		this.loadnrHolidays();
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

  	loadActiveDocs = () => {
    	fetch('http://localhost:3000/sked/docs')
      		.then(response => response.json())
      		.then(docs => {
      			if (!this.state.render){
      				const doctors = [...docs];
      				for (let i = 0; i < doctors.length; i++){
      					if (doctors[i].id === this.props.user.id){
      						this.loadPersonalDays(i,doctors);
      						this.setState({
      							docIndex: i
      						})
      					}
      				}
      			}
      			this.setState({activeDocs: docs})
      		});

  	}

  	loadEntries = () => {
  		fetch('http://localhost:3000/sked/entries')
      		.then(response => response.json())
      		.then(entries => this.setState({entries: entries.filter((entry => entry.isactive === true))}));
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

	loadPersonalSked = (user) => {
		let activeDocs = [...this.state.activeDocs];
		for (let i = 0; i < activeDocs.length; i++){
			if (user.id === activeDocs[i].id){
				let currentUser = Object.assign({}, activeDocs[i]);
				currentUser.worksked = [...user.worksked];
				activeDocs[i] = currentUser;
				this.setState({
					activeDocs: activeDocs,
					personalDays: currentUser.worksked
				});
			}
		}
	}

	loadPersonalDays = (index, docs = this.state.activeDocs) => {
		this.setState({
			personalDays: [...docs[index].worksked]
		})
		
	}

	onDayClick = (e,day) => {
		const id = this.state.entries[this.state.entryIndex].id;
		if (id === 12){
			this.setState({day:day})
			this.toggleShow();
		}
		else{
			this.assignOrDelete(id, day);
		}
	}

	assignCall = (typeID, method, date) => {
		fetch('http://localhost:3000/sked/assign', {
			method: method,
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				docId: this.state.activeDocs[this.state.docIndex].id,
				typeId: typeID,
				date: date
			})
		})
		.then(response => response.json())
		.then(user => {
			if (user.lastname){
				this.loadPersonalSked(user);
			}
		})
		if (this.state.radio !== -1){
			this.toggleShow();
		}
	}
		

	assignOrDelete = (typeId, day = this.state.day) => {
		if (this.props.testisadmin && (typeId !== -1)){
			let method = 'post';
			const date = this.state.dateContext.format('MM')+'/'+day+'/'+this.state.dateContext.format('YYYY');
			const typeID = parseInt(typeId,10);
			for (let i = 0;  i < this.state.personalDays.length; i++){
				if (this.state.personalDays[i].date === date && typeID === this.state.personalDays[i].id){
					method = 'delete';
					break;
				}
			}
			this.assignCall(typeID, method, date);
		}
		this.setState({
				day:0,
				radio:-1,
				typeId:-1
		})
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

	nextDoc = () => {
		let i = this.state.docIndex;
		if (i !== (this.state.activeDocs.length - 1)){
			this.loadPersonalDays(i+1);
			this.setState({docIndex: (i+1)});
		}
		else{
			this.loadPersonalDays(0);
			this.setState({docIndex: 0});
		}
	}
	prevDoc = () => {
		let i = this.state.docIndex;
		if (i !== 0){
			this.loadPersonalDays(i-1);
			this.setState({docIndex: (i-1)});
		}
		else{
			this.loadPersonalDays(this.state.activeDocs.length - 1);
			this.setState({docIndex: (this.state.activeDocs.length - 1)});
		}
	}
	nextEntry = () => {
		let i = this.state.entryIndex;
		if (i !== (this.state.entries.length - 1)){
			this.setState({entryIndex: (i+1)});
		}
		else{
			this.setState({entryIndex: 0});
		}
	}

	prevEntry = () => {
		let i = this.state.entryIndex;
		if (i !== 0){
			this.setState({entryIndex: (i-1)});

		}
		else{
			this.setState({entryIndex: (this.state.entries.length - 1)});
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

	onPhysicianChange = (event) => {
		if (event.target.key){
			this.loadPersonalDays(event.target.key);
			this.setState({docIndex: event.target.key})
		}
		else{
			let index = -1;
			for (let i = 0; i < this.state.activeDocs.length; i++){
				if (this.state.activeDocs[i].lastname === event.target.value){
					index = i;
					break;
				}
			}
			this.loadPersonalDays(index);
			this.setState({docIndex: index})
		}
	}

	onEntryChange = (event) => {
		let index = -1;
		for (let i = 0; i < this.state.entries.length; i++){
			if (this.state.entries[i].name === event.target.value){
				index = i;
				break;
			}
		}
		this.setState({entryIndex: index})
	}

	onMonthChange = (event) => {
		this.setMonth(event.target.value);
		this.setState({month: event.target.value})
	}

	onYearChange = (event) => {
		this.setYear(event.target.value);
	}

	radioChange = (event) => {
		
		this.setState({radio: event.target.id})

	}

	toggleShow = () => {
		this.setState({show: !this.state.show})
	}

	adminButton = (isadmin) => {
		if (isadmin){
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
		this.loadNewDays(this.props.today);
	}
	

	render(){
		const {show, dateContext, activeDocs, docIndex, entries, entryIndex, callList, holiDays, nrHolidayList, render, personalDays} = this.state;
		const {testisadmin, user, today} = this.props;

		let docSelect = activeDocs.map((doc,i) => {
			return <option key={i} value={doc.lastname}>{doc.lastname}</option>
		})

		let adminSelect = (isadmin, user) => {
			if (isadmin && activeDocs.length!==0){
				return (
					<select value={activeDocs[docIndex].lastname} onChange={this.onPhysicianChange} className="top-child doc selector">
  						{docSelect}
					</select>
				);
			}
			else{
				return (
					<h6 className="top-child">{user.lastname}</h6>
				);
			}
		}

		let entrySelect = entries.map((entry, i) => {
				return <option key={i} value={entry.name}>{entry.name}</option>
		})

		let eSelect = () => {
			if (entries.length !== 0){
				return (
					<select value={entries[entryIndex].name} onChange={this.onEntryChange} className="top-child types selector">
						{entrySelect}
					</select>
				);
			}
			else{
				return <p>Entries</p>
			}
		}

		let yearSelect = [];

		let fYear = today.year();

		for (let i = 2020; i <= fYear + 10; i++){
			yearSelect.push(<option key={i} value={i}>{i}</option>)
		}

		let radioSelect = [];
		for (let j = 0; j < callList.length; j++){
			radioSelect.push(
				<Form.Check required key={j} name="callType" type='radio' id={callList[j].id} label={callList[j].name}/>
			)
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
					<Col >{adminSelect(testisadmin, user)}</Col>
					<Col >{eSelect()}</Col>
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
						{this.adminButton(testisadmin)}
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
					{ (nrHolidayList.length > 0 && !render)
						?this.loadNewDays(this.props.today)
						: false
					}
					<Calendar entries={entries} callList={callList} personalDays={personalDays} holiDays={holiDays} type="Personal" dateContext={dateContext} today={today} style={style} onDayClick={(e,day) => this.onDayClick(e,day)}/>
				</div>
				<div className="bottom">
					{/*<Col ><Button onClick={this.createPDF} variant="primary">Download as PDF</Button></Col>*/}
					<Col><PDFDownloadLink document={<MyDocument entries={entries} callList={callList} personalDays={personalDays} holiDays={holiDays} type="Personal" dateContext={dateContext} today={today} style={style} onDayClick={(e,day) => this.onDayClick(e,day)} user={this.props.user}/>} fileName={dateContext.format('MMMM')+dateContext.format('Y')+'pesonalsked.pdf'}>
      					{({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download as PDF')}
    				</PDFDownloadLink></Col>
				</div>

				<div className='modal'>
					<Modal show={show} onHide={this.toggleShow}>
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>Select Call Type</Modal.Title>
       	 				</Modal.Header>
        				<Form>
        					<Modal.Body>
        					<Form.Group onChange={this.radioChange} controlId="formBasicRadio">
      							{radioSelect}
  							</Form.Group>
        				</Modal.Body>
        				<Modal.Footer>
          					<Button onClick={this.toggleShow} variant="secondary" >
            					Close
          					</Button>
          					 <Button onClick={() => this.assignOrDelete(this.state.radio)} variant="primary" >
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