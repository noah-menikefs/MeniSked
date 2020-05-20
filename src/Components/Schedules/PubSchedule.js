import React from 'react';
import Calendar from './Calendar/Calendar';
import Button from 'react-bootstrap/button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './Schedules.css';

const style = {
	position: "relative",
	margin: "10px auto"
}

class PubSchedule extends React.Component{
	constructor(){
		super();
		this.state = {

		}
	}

	onDayClick = (e,day) => {
		alert(day);
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
					<Col ><select className="top-child month selector">
	  					<option selected>January</option>
	  					<option value="1">February</option>
	  					<option value="2">March</option>
					</select></Col>
					<Col ><select className="top-child year selector">
	  					<option selected>2020</option>
	  					<option value="1">2021</option>
	  					<option value="2">2022</option>
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

			</div>
		);



	}


}

export default PubSchedule;