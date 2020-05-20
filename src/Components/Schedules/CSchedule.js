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

class CSchedule extends React.Component{
	constructor(){
		super();
		this.state = {

		}
	}

	onDayClick = (e,day) => {
		alert(day);
	}

	

	render(){
		return(
			<div className="screen">
				<Row className="labels">
					<Col sm><h5 className="labels-child">Month</h5></Col>
					<Col sm><h5 className="labels-child">Year</h5></Col>
					<Col sm><Button id="today" className="top-child"variant="primary">Today</Button></Col>
				</Row>
				<Row className="header">

					<Col sm><select className="top-child month selector">
	  					<option selected>January</option>
	  					<option value="1">February</option>
	  					<option value="2">March</option>
					</select></Col>
					<Col sm><select className="top-child year selector">
	  					<option selected>2020</option>
	  					<option value="1">2021</option>
	  					<option value="2">2022</option>
					</select></Col>
					<Col sm><p className="vis top-child"></p></Col>

				</Row>
				<Row className="subheader">
					<Col sm >
						<Button className="arrow top-child"variant="secondary">&#9668;</Button>
						<Button className="arrow top-child"variant="secondary">&#9658;</Button>
					</Col>
					<Col sm>
						<Button className="arrow top-child"variant="secondary">&#9668;</Button>
						<Button className="arrow top-child"variant="secondary">&#9658;</Button>
					</Col>
					<Col sm>
						<p className="vis top-child"></p>
					</Col>


				</Row>
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

export default CSchedule;