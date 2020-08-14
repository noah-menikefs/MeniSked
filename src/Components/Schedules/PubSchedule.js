import React from 'react';
import Calendar from './Calendar/Calendar';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyDocument from './../PDF/MyDocument'
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

class PubSchedule extends React.Component{
	constructor(){
		super();
		this.state = {
			numNotes: [],
			vNotes: [],
			iNotes: [],
			show: false,
			dateContext: moment(),
			note: '',
			radio: 0,
			rHolidayList: [],
			nrHolidayList: [],
			holiDays: [],
			render: false,
			sked: [],
			entryList: [],
			day: -1,
			published: -1,
			depts: [],
			stamp: ''
		}
	}

	componentDidMount = () => {
   		this.loadAllNotes();
   		this.loadrHolidays();
   		this.loadnrHolidays();
   		this.loadEntries();
   		this.props.loadCallTypes();
   		this.loadSked();
   		this.loadPublished();
   		this.loadDepts();
  	}

  	loadPublished = () => {
  		fetch('https://secure-earth-82827.herokuapp.com/published')
      		.then(response => response.json())
      		.then(num => this.setState({published: num}));
  	}

  	publishSked = () => {
		var a = moment([2020, 5, 1]);
		var b = this.state.dateContext;
		const num = b.diff(a, 'months');
		fetch('https://secure-earth-82827.herokuapp.com/published', {
			method: 'put',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				newNum: num
			})
		})
		.then(response => response.json())
		.then(num => this.setState({published: num}));
  	}

  	loadSked = () => {
    	fetch('https://secure-earth-82827.herokuapp.com/people')
      		.then(response => response.json())
      		.then(docs => {
      			let arr = [];
      			for (let i = 0; i < docs.length; i++){
      				for (let j = 0; j < docs[i].worksked.length; j++){
      					arr.push({
      						id: docs[i].worksked[j].id,
      						date: docs[i].worksked[j].date,
      						name: docs[i].lastname,
      						colour: docs[i].colour,
      						priority: this.priorityCheck(docs[i].worksked[j].id)
      					})
      				}
      			}
      			arr.sort(function(a, b){return a.priority - b.priority})
      			this.setState({sked: arr})
      		});
  	}

  	loadDepts = () => {
   		fetch('https://secure-earth-82827.herokuapp.com/departments')
			.then(response => response.json())
			.then(departments => this.setState({depts: departments}));
   	}

  	priorityCheck = (id) => {
  		const {callList} = this.props;
  		let index = -1;
		for (let n = 0; n < callList.length; n++){
			if (callList[n].id === id){
				index = n;
				break;
			}
		}
		if (index !== -1){
			return callList[index].priority;
		}
		else{
			return 1000;
		}	
  	}

  	loadEntries = () => {
  		fetch('https://secure-earth-82827.herokuapp.com/sked/entries')
      		.then(response => response.json())
      		.then(entries => this.setState({entryList: entries.filter((entry => entry.isactive === true))}));
  	}

  	loadAllNotes = () => {
    	fetch('https://secure-earth-82827.herokuapp.com/sked/allNotes')
      		.then(response => response.json())
      		.then(notes => this.setState({
      			numNotes: notes.filter((note => note.type === 1)),
      			vNotes: notes.filter((note => note.type === 2)),
      			iNotes: notes.filter((note => note.type === 3))
      		}));

  	}

  	loadrHolidays = () => {
		fetch('https://secure-earth-82827.herokuapp.com/holiday/r')
			.then(response => response.json())
			.then(holidays => this.setState({rHolidayList: holidays.filter((holiday => holiday.isactive === true))}));
	}

	loadnrHolidays = () => {
		fetch('https://secure-earth-82827.herokuapp.com/holiday/nr')
			.then(response => response.json())
			.then(holidays => this.setState({nrHolidayList: holidays}));
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
			day: day
		});
		this.toggleShow(day);
	}

	toggleShow = (day) => {
		this.setState({show: !this.state.show});
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
		if (!this.props.user.isadmin){
			let nMonth = moment([2020, 5, 1]).add(this.state.published, 'month').month();
			let nYear = moment([2020, 5, 1]).add(this.state.published, 'month').year();
			if (dateContext.year() < nYear){
				this.setState({
					dateContext: dateContext
				});
				this.loadNewDays(dateContext);
			}
			else if (dateContext.year() === nYear){
				if (dateContext.month() <= nMonth){
					this.setState({
						dateContext: dateContext,
					});
					this.loadNewDays(dateContext);
				}
				
			}
		}
		else if (dateContext.year() <= (this.props.today.year() + 10)){
			this.setState({
				dateContext: dateContext,
			});
			this.loadNewDays(dateContext);
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
		}
	}

	nextYear = () => {
		if (!this.props.user.isadmin){
			let nYear = moment([2020, 5, 1]).add(this.state.published, 'month').year();
			if ((this.state.dateContext.year() + 1) <= nYear){
				let dateContext = Object.assign({}, this.state.dateContext);
				dateContext = moment(dateContext).add(1, "year");
				this.setState({
					dateContext: dateContext
				});
				this.loadNewDays(dateContext);
			}
		}
		else if ((this.state.dateContext.year() + 1) <= (this.props.today.year() + 10)){
			let dateContext = Object.assign({}, this.state.dateContext);
			dateContext = moment(dateContext).add(1, "year");
			this.setState({
				dateContext: dateContext
			});
			this.loadNewDays(dateContext);
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
		}
	}

	setYear = (year) => {
		const {published} = this.state;
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).set("year",year);
		if (!this.props.user.isadmin){
			let nMonth = moment([2020, 5, 1]).add(published, 'month').month();
			let nYear = moment([2020, 5, 1]).add(published, 'month').year();
			if (dateContext.year() === nYear && nMonth < dateContext.month()){
				dateContext = moment(dateContext).set("month",nMonth);
			}
		}
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
		const {note, radio, dateContext, day} = this.state;
		if (note.length > 0 && radio > 0){
			fetch('https://secure-earth-82827.herokuapp.com/sked/notes', {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					date: dateContext.format('MM')+'/'+day+'/'+dateContext.format('Y'),
					type: parseInt(radio,10),
					msg: note

				})
			})
			.then(response => response.json())
			.then(notes => {
				if (notes.id){
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
		const {today} = this.props;
		this.setState({dateContext: today});
		this.loadNewDays(today);
	}

	
	yearSelect = () => {
		let arr = [];
		let fYear = this.props.today.year();
		if (this.props.user.isadmin){
			for (let i = 2020; i <= fYear + 10; i++){
				arr.push(<option key={i} value={i}>{i}</option>);
			}
		}
		else{
			let nYear = moment([2020, 5, 1]).add(this.state.published, 'month').year();
			for (let i = 2020; i <= nYear; i++){
				arr.push(<option key={i} value={i}>{i}</option>);
			}
		}
		return arr;
	}

	monthSelect = () => {
		const {published, dateContext} = this.state;
		const {user} = this.props;
		let m = 11;
		let arr = [];
		if (!user.isadmin){
			let nYear = moment([2020, 5, 1]).add(published, 'month').year();
			let nMonth = moment([2020, 5, 1]).add(published, 'month').month();
			if (dateContext.year() === nYear){
				m = nMonth;
			}
		}
		for (let i = 0; i <= m; i++){
			arr.push(<option key={i} value={this.months[i]}>{this.months[i]}</option>);
		}
		return arr;
	}

	publishShow = () => {
		const {published, dateContext} = this.state;
		const {user} = this.props;
		if (user.isadmin){
			let nYear = moment([2020, 5, 1]).add(published, 'month').year();
			let nMonth = moment([2020, 5, 1]).add(published, 'month').month();
			let p = true
			if (dateContext.year() === nYear){
				if (dateContext.month() > nMonth){
					p = false;
				}
			}
			else if (dateContext.year() > nYear){
				p = false;
			}
			if (p){
				return (<Col><h5>Published</h5></Col>)
			}
			return (<Col><Button onClick={this.publishSked} className="top-child" variant="primary">Publish</Button></Col>);
		}
		else{
			return (<Col><p></p></Col>);
		}
	}

	adminNotes = () => {
		if (this.props.user.isadmin){
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

	idToName = (id) => {
		const {callList} = this.props;
		const {entryList} = this.state;
		for (let n = 0; n < callList.length; n++){
				if (callList[n].id === id){
					return callList[n].name;
				}
			}
		for (let i = 0; i < entryList.length; i++){
			if (entryList[i].id === id){
				return entryList[i].name;
			}
		}
	}

	hoverSpan = () => {
		this.setState({stamp: moment().format("YYYY-MM-DD h:mm:ss a")})
	}

	render(){
		const {show, dateContext, numNotes, vNotes, iNotes, nrHolidayList, render, holiDays, sked, entryList, day, depts, stamp} = this.state;
		const {today, user, callList} = this.props;

		let modalList = [];
		for (let i = 0; i < sked.length; i++){
			const splitArr = sked[i].date.split('/');
			if (splitArr[0] === dateContext.format('MM') && parseInt(splitArr[1],10) === day && splitArr[2] === dateContext.format('YYYY')){
				modalList.push(<li key={i}>{this.idToName(sked[i].id) + ' '}<span style={{'backgroundColor':sked[i].colour}}>{sked[i].name}</span></li>);
			}
		}

		let noteList = [];
		for (let i = 0; i < vNotes.length; i++){
			const splitArr = vNotes[i].date.split('/');
			if (splitArr[0] === dateContext.format('MM') && parseInt(splitArr[1],10) === day && splitArr[2] === dateContext.format('YYYY')){
				noteList.push(<li key={i} id="notes">{vNotes[i].msg}</li>);
			}
		}
		if (user.isadmin){
			for (let i = 0; i < iNotes.length; i++){
				const splitArr = iNotes[i].date.split('/');
				if (splitArr[0] === dateContext.format('MM') && parseInt(splitArr[1],10) === day && splitArr[2] === dateContext.format('YYYY')){
					noteList.push(<li key={i} id="iNotes">{iNotes[i].msg}</li>);
				}
			}
		}


		return(
			<div className="screen">
				<div>
					<Row className="plabels">
						{this.publishShow()}
						<Col><h5 className="labels-child">Month</h5></Col>
						<Col><h5 className="labels-child">Year</h5></Col>
						<Col><Button onClick={this.reset} id="today" className="top-child" variant="primary">Today</Button></Col>
					</Row>
					<Row>
						<Col ><p></p></Col>
						<Col><select value={this.state.dateContext.format('MMMM')} onChange={this.onMonthChange} className="top-child month selector">
	  						{this.monthSelect()}
						</select></Col>
						<Col ><select value={this.state.dateContext.format('Y')} onChange={this.onYearChange} className="top-child year selector">
	  						{this.yearSelect()}
						</select></Col>
						<Col ><p></p></Col>
					</Row>
					<Row className="psubheader">
						<Col >
							<p></p>
						</Col>
						<Col>
							<Button onClick={this.prevMonth} className="arrow top-child"variant="secondary">&#x25C0;</Button>
							<Button onClick={this.nextMonth} className="arrow top-child"variant="secondary">&#x25C0;</Button>
						</Col>
						<Col>
							<Button onClick={this.prevYear} className="arrow top-child"variant="secondary">&#x25C0;</Button>
							<Button onClick={this.nextYear} className="arrow top-child"variant="secondary">&#x25B6;</Button>
						</Col>
						<Col >
							<p></p>
						</Col>
					</Row>
				</div>
				<Row className="curr">
					<Col xl><h3>{dateContext.format('MMMM')+' '+dateContext.format('Y')}</h3></Col>
				</Row>
				<div className="sked">
					{ (nrHolidayList.length > 0 && !render)
						?this.loadNewDays(this.props.today)
						: false
					}
					<Calendar testisadmin={user.isadmin} numNotes={numNotes} vNotes={vNotes} iNotes={iNotes} callList={callList} entries={entryList} sked={sked} holiDays={holiDays} type="Published" dateContext={dateContext} today={today} style={style} onDayClick={(e,day) => this.onDayClick(e,day)}/>
				</div>
				<div className="bottom">
					<Col id='downloadLink'><PDFDownloadLink document={<MyDocument stamp={stamp} depts={depts} numNotes={numNotes} vNotes={vNotes} iNotes={iNotes} holiDays={holiDays} callList={callList} entries={entryList} sked={sked} type="Published" dateContext={dateContext} user={user} />} fileName={dateContext.format('MMMM')+dateContext.format('Y')+'publishedsked.pdf'}>
      					{({ blob, url, loading, error }) => (loading ? 'Loading document...' : <span onMouseOver={this.hoverSpan}>Download as PDF</span>)}
    				</PDFDownloadLink></Col>
				</div>

				<div className='modal'>
					<Modal show={show} onHide={this.toggleShow} >
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>{dateContext.format('MMMM')+' '+day+' '+dateContext.format('Y')}</Modal.Title>
       	 				</Modal.Header>
        				<Modal.Body>
        					<ul>
        						{modalList}
        					</ul>
        					<ul>
        						{noteList}
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