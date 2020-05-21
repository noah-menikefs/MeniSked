import React from 'react';
import Calendar from './Calendar/Calendar';
import Button from 'react-bootstrap/button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

import './Schedules.css';

const style = {
	position: "relative",
	margin: "10px auto"
}

class PubSchedule extends React.Component{
	constructor(){
		super();
		this.state = {
			show: false,
			day: '',
			month: 'January',
			year: '2020'
		}
	}

	onDayClick = (e,day) => {
		this.toggleShow(day);
	}

	toggleShow = (day) => {
		this.setState({show: !this.state.show})
		this.setState({day: day})
	}

	yearChange = (e) => {
		this.setState({year: e.target.value})
	}

	monthChange = (e) => {
		this.setState({month: e.target.value})
	}

	adminSelect(isAdmin, user){
		if (isAdmin){
			return (
				<div>
				<Row className="labels">
					<Col sm><h5 className="labels-child">Month</h5></Col>
					<Col sm><h5 className="labels-child">Year</h5></Col>
					<Col ><Button id="today" className="top-child"variant="primary">Today</Button></Col>
				</Row>
				<Row>
					<Col ><select onChange={this.monthChange} className="top-child month selector">
	  					<option value="January" selected>January</option>
	  					<option value="February">February</option>
	  					<option value="March">March</option>
					</select></Col>
					<Col ><select onChange={this.yearChange} className="top-child year selector">
	  					<option value="2020" selected>2020</option>
	  					<option value="2021">2021</option>
	  					<option value="2022">2022</option>
					</select></Col>
					<Col ><p></p></Col>
				</Row>
				<Row className="subheader">
	
					<Col >
						<Button className="arrow top-child"variant="secondary">&#9668;</Button>
						<Button className="arrow top-child"variant="secondary">&#9658;</Button>
					</Col>
					<Col >
						<Button className="arrow top-child"variant="secondary">&#9668;</Button>
						<Button className="arrow top-child"variant="secondary">&#9658;</Button>
					</Col>
					<Col >
						<p></p>
					</Col>
				</Row>
				</div>
			);
		}
	}

	render(){
		const {show, day, month, year} = this.state;
		const {testIsAdmin, user} = this.props;
		return(
			<div className="screen">
				<div className="">
					<h2 className="title">June 2020</h2>
					{this.adminSelect(testIsAdmin, user)}
				</div>
				<div className="sked">
					<Calendar style={style} width="90%" onDayClick={(e,day) => this.onDayClick(e,day)}/>
				</div>
				<div className="bottom">
					<Col ><Button variant="primary">Download as PDF</Button></Col>
				</div>

				<div className='modal'>
					<Modal show={show} onHide={this.toggleShow} >
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>{month +' '+ day + ', ' + year}</Modal.Title>
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