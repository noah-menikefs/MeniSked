import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Scroll from './../Scroll/Scroll';
import moment from 'moment';
import './Settings.css';

class Holidays extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			rHolidayList: [

			],
			nrHolidayList: [

			],
			newNRshow: false,
			newRshow: false,
			sShow: false,
			add: false,
			name: '',
			month: "January",
			day: 1,
			isActive: false,
			dateContext: moment()
		}
	}

	componentDidMount = () => {
		this.loadrHolidays();
		this.loadnrHolidays();
	}

	loadrHolidays = () => {
		fetch('http://localhost:3000/holiday/r')
			.then(response => response.json())
			.then(holidays => this.setState({rHolidayList: holidays}));
	}

	loadnrHolidays = () => {
		fetch('http://localhost:3000/holiday/nr')
			.then(response => response.json())
			.then(holidays => this.setState({nrHolidayList: holidays}));
	}

	months = moment.months();

	addOrEdit = () => {
		console.log(this.state.add);
		if (this.state.add === true){
			this.onNewRHoliday();
		}
		else{
			this.onEditRHoliday();
		}
	}

	onNewRHoliday = () => {
		fetch('http://localhost:3000/holiday/r', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: this.state.name,
				isActive: this.state.isActive,
				month: this.state.month,
				day: this.state.day

			})
		})
			.then(response => response.json())
			.then(holiday => {
				if (holiday){
					this.loadrHolidays();
				}
			})
		this.toggleRShow();
	}

	onNewNRHoliday = () => {
		fetch('http://localhost:3000/holiday/nr', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: this.state.name,
			})
		})
			.then(response => response.json())
			.then(holiday => {
				if (holiday){
					this.loadnrHolidays();
				}
			})
		this.toggleNRShow();
	}

	onEditRHoliday = () => {
		fetch('http://localhost:3000/holiday/r', {
			method: 'put',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: this.state.name,
				isActive: this.state.isActive,
				month: this.state.month,
				day: this.state.day

			})
		})
			.then(response => response.json())
			.then(holiday => {
				if (holiday){
					this.loadrHolidays();
				}
			})
		this.toggleRShow();
	}
	onDeleteRHoliday = (e) => {
		fetch('http://localhost:3000/holiday/r', {
			method: 'delete',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: e.target.parentNode.id
			})
		})
			.then(response => response.json())
			.then(holiday => {
				if (holiday){
					this.loadrHolidays();
				}
			})
	}

	onNameChange = (event) => {
		this.setState({name: event.target.value})
	}

	onMonthChange = (event, r = true) => {
		this.setState({month: event.target.value});
		if (!r){
			this.setMonth(event.target.value);
		}
	}

	setMonth = (month) => {
		let monthNo = this.months.indexOf(month);
		let dateContext = Object.assign({}, this.state.dateContext)
		dateContext = moment(dateContext).set("month", monthNo);
		this.setState({
			dateContext: dateContext
		});
	}

	onDayChange = (event) => {
		this.setState({day: event.target.value})
	}

	onYearChange = (event, r = true) => {
		this.setYear(event.target.value);
	}

	onActiveChange = () => {
		this.setState({isActive: !this.state.isActive});
	}

	setYear = (year) => {
		let dateContext = Object.assign({}, this.state.dateContext);
		dateContext = moment(dateContext).set("year",year);
		this.setState({
			dateContext: dateContext
		})
	}

	toggleNRShow = () => {
		this.setState({newNRshow: !this.state.newNRshow});
	}

	toggleRShow = (e) => {
		
		if (typeof e !== 'undefined'){
			if (e.target.className.includes('add')){
				this.setState({add: true});
			}
			else{
				this.setState({add: false});
				for (let i = 0; i < this.state.rHolidayList.length; i++){
					if (this.state.rHolidayList[i].name === e.target.parentNode.id){
						this.setState({
							name: this.state.rHolidayList[i].name,
							month: this.state.rHolidayList[i].month,
							day: this.state.rHolidayList[i].day,
							isActive: this.state.rHolidayList[i].isActive
						});
					}
				}
				
			}
		}
		this.setState({newRshow: !this.state.newRshow});
	}

	toggleSShow = (e) => {
		if (typeof e !== 'undefined'){
			this.setState({name: e.target.parentNode.id});
		}
		this.setState({sShow: !this.state.sShow});
	}

	addModal = () => {
		if (this.state.add === true){
			return <Form.Control onChange={this.onNameChange} required type="text" placeholder="Name" />;
		}
		return <h5>{this.state.name}</h5>;
	}

	render(){
		const {rHolidayList, nrHolidayList, newNRshow, newRshow, sShow, dateContext, name, month, day, isActive} = this.state;
		const {today} = this.props;
		
		let daySelect = [];
		for (let i = 1; i <= dateContext.daysInMonth(); i++){
			daySelect.push(<option key={i} value={i}>{i}</option>)
		}

		let yearSelect = [];

		let fYear = today.year();

		for (let i = fYear; i <= fYear + 10; i++){
			yearSelect.push(<option key={i} value={i}>{i}</option>)
		}


		let rList = [];
		for (let j = 0; j < rHolidayList.length; j++){
			rList.push(
				<li key={rHolidayList[j].name} id={rHolidayList[j].name}>
					{rHolidayList[j].name}
					<Button key={j} onClick={this.toggleRShow} className="edit butn" size="sm" variant="secondary">Edit</Button>
					<Button key={-j-1} onClick={this.onDeleteRHoliday} className="delete butn" size="sm" variant="danger">Delete</Button>
				</li>
			)
		}
		let nrList = [];
		for (let n = 0; n < nrHolidayList.length; n++){
			nrList.push(
				<li key={nrHolidayList[n].name} id={nrHolidayList[n].name}>
					{nrHolidayList[n].name}
					<Button key={n} onClick={this.toggleSShow} className="sked butn" size="sm" variant="secondary">Schedule</Button>
					<Button key={-n-1} onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
				</li>
			)
		}

		return(
			<div className="body">
				<div className="left">
					
					<div className="top">
						<h4 className="subtitle">Recurring Holidays</h4>
						<Button className="add" onClick={this.toggleRShow} variant="primary">Add Recurring Holiday</Button>
					</div>
					<Scroll>
						<ul className="">
							{rList}
						</ul>
					</Scroll>
				</div>
				<div className="right">
					<div className="top">
						<h4 className="subtitle">Non-recurring Holidays</h4>
						<Button onClick={this.toggleNRShow} variant="primary">Add Non-recurring Holiday</Button>
					</div>
					<Scroll>
						<ul className="">
							{nrList}


						</ul>
					</Scroll>
				</div>
				<div className='modal'>
					<Modal show={newNRshow} onHide={this.toggleNRShow} onSubmit={this.onNewNRHoliday}>
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>Add Non-recurring Holiday</Modal.Title>
       	 				</Modal.Header>
        				<Form>
        					<Modal.Body>
        					<Form.Group >
      							 <Form.Control onChange={this.onNameChange} required type="text" placeholder="Name" />
  							</Form.Group>
        				</Modal.Body>
        				<Modal.Footer>
          					<Button onClick={this.toggleNRShow} variant="secondary" >
            					Cancel
          					</Button>
          					 <Button type="submit" variant="primary" >
            					Submit
          					</Button>
	        			</Modal.Footer>
	        			</Form>
      				</Modal>
				</div>
				<div className='modal'>
					<Modal show={newRshow} onHide={this.toggleRShow} onSubmit={this.addOrEdit}>
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>Add/Edit Recurring Holiday</Modal.Title>
       	 				</Modal.Header>
        				<Form>
        					<Modal.Body>
        					<Form.Group >
      							 {this.addModal()}
  							</Form.Group>
  							<Form.Group >
								<Form.Label>Month</Form.Label>
								<Form.Control value={month} onChange={this.onMonthChange} as="select">
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
							    </Form.Control>
							</Form.Group>
							<Form.Group >
								<Form.Label>Day of the Month</Form.Label>
							    <Form.Control value={day} onChange={this.onDayChange} as="select">
							    	<option value="1">1</option>
	  								<option value="2">2</option>
	  								<option value="3">3</option>
	  								<option value="4">4</option>
	  								<option value="5">5</option>
	  								<option value="6">6</option>
	  								<option value="7">7</option>
	  								<option value="8">8</option>
	  								<option value="9">9</option>
	  								<option value="10">10</option>
	  								<option value="11">11</option>
	  								<option value="12">12</option>
	  								<option value="13">13</option>
	  								<option value="14">14</option>
	  								<option value="15">15</option>
	  								<option value="16">16</option>
	  								<option value="17">17</option>
	  								<option value="18">18</option>
	  								<option value="19">19</option>
	  								<option value="20">20</option>
	  								<option value="21">21</option>
	  								<option value="22">22</option>
	  								<option value="23">23</option>
	  								<option value="24">24</option>
	  								<option value="25">25</option>
	  								<option value="26">26</option>
	  								<option value="27">27</option>
	  								<option value="28">28</option>
	  								<option value="29">29</option>
	  								<option value="30">30</option>
	  								<option value="31">31</option>

							    </Form.Control>
							</Form.Group>
							<Form.Group onChange={this.onActiveChange} id="activeCheck" controlId="formBasicCheckbox">
						    	<Form.Check checked={isActive} type="checkbox" label="Active"/>
						 	 </Form.Group>
        				</Modal.Body>
        				<Modal.Footer>
          					<Button onClick={this.toggleRShow} variant="secondary" >
            					Cancel
          					</Button>
          					 <Button type="submit" variant="primary">
            					Submit
          					</Button>
	        			</Modal.Footer>
	        			</Form>
      				</Modal>
				</div>
				<div className='modal'>
					<Modal show={sShow} onHide={this.toggleSShow} onSubmit={this.toggleSShow}>
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>Schedule Holiday</Modal.Title>
       	 				</Modal.Header>
        				<Form>
        					<Modal.Body>
        					<Form.Group>
        						<h3>{name}</h3>
        					</Form.Group>
        					<Form.Group >
        						<Form.Label>Year</Form.Label>
								<Form.Control value={dateContext.format('Y')} onChange={this.onYearChange} as="select">
							    	{yearSelect}
							    </Form.Control>
  							</Form.Group>
  							<Form.Group >
								<Form.Label>Month</Form.Label>
								<Form.Control onChange={(e) => this.onMonthChange(e,false)} as="select">
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
							    </Form.Control>
							</Form.Group>
							<Form.Group >
								<Form.Label>Day of the Month</Form.Label>
							    <Form.Control as="select">
							    	{daySelect}
							    </Form.Control>
							</Form.Group>
        				</Modal.Body>
        				<Modal.Footer>
          					<Button onClick={this.toggleSShow} variant="secondary" >
            					Cancel
          					</Button>
          					 <Button type="submit" variant="primary">
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

export default Holidays;