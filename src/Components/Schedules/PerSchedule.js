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


class PerSchedule extends React.Component{
	constructor(props){
		super(props);
		this.state = {

			
		}
	}

	onDayClick = (e,day) => {
		alert(day);
	}

	adminSelect(isAdmin, user){
		if (isAdmin){
			return (
				<select className="top-child doc selector">
  					<option selected>Ismail</option>
  					<option value="1">Menikefs</option>
  					<option value="2">Miskew</option>
 				 	<option value="3">Weiss</option>
				</select>
			);
		}
		else{
			return (
				<h6 className="top-child">{user.lastName}</h6>
			);
		}
	}


	render(){
		const {testIsAdmin, user} = this.props;
		return(
			<div className="screen">
				<Row className="labels">
					<Col sm><h5 className="labels-child">Physician</h5></Col>
					<Col sm><h5 className="labels-child">Type of Entry</h5></Col>
					<Col sm><h5 className="labels-child">Month</h5></Col>
					<Col sm><h5 className="labels-child">Year</h5></Col>
					<Col ><Button id="today" className="top-child"variant="primary">Today</Button></Col>
				</Row>
				<Row className="header">
					<Col >{this.adminSelect(testIsAdmin, user)}</Col>
					<Col ><select className="top-child types selector">
	  					<option selected>Request No Call</option>
	  					<option value="1">Vacation</option>
	  					<option value="2">Assign Call Type</option>
					</select></Col>
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
					<Col sm><p className="vis labels-child"></p></Col>
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
						<Button className="arrow top-child"variant="secondary">&#9668;</Button>
						<Button className="arrow top-child"variant="secondary">&#9658;</Button>
					</Col>
					<Col >
						<Button className="arrow top-child"variant="secondary">&#9668;</Button>
						<Button className="arrow top-child"variant="secondary">&#9658;</Button>
					</Col>
					<Col >
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

export default PerSchedule;