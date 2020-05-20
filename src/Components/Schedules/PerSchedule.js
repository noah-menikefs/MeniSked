import React from 'react';
import Calendar from './Calendar/Calendar';
import Button from 'react-bootstrap/button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


import './Schedules.css';

const style = {
	position: "relative",
	margin: "10px auto"
}


class PerSchedule extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			physician: 'Ismail',
			entry: 'Request No Call',
			month: 'January',
			year: '2020',
			show: false
		}
	}

	onDayClick = (e,day) => {
		console.log(this.state.entry);
		if (this.state.entry === "Assign Call Type"){
			this.toggleShow();
		}
	}

	onPhysicianChange = (event) => {
		this.setState({physician: event.target.value})
	}

	onEntryChange = (event) => {
		this.setState({entry: event.target.value})
	}

	onMonthChange = (event) => {
		this.setState({month: event.target.value})
	}

	onYearChange = (event) => {
		this.setState({year: event.target.value})
	}

	toggleShow = () => {
		this.setState({show: !this.state.show})
	}


	adminSelect(isAdmin, user){
		if (isAdmin){
			return (
				<select onChange={this.onPhysicianChange} className="top-child doc selector">
  					<option value="Ismail" selected>Ismail</option>
  					<option value="Menikefs">Menikefs</option>
  					<option value="Miskew">Miskew</option>
 				 	<option value="Weiss">Weiss</option>
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
		const {show} = this.state;
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
					<Col ><select onChange={this.onEntryChange} className="top-child types selector">
	  					<option value="Request No Call" selected>Request No Call</option>
	  					<option value="Vacation">Vacation</option>
	  					<option value="Assign Call Type">Assign Call Type</option>
					</select></Col>
					<Col ><select onChange={this.onMonthChange} className="top-child month selector">
	  					<option value="January" selected>January</option>
	  					<option value="February">February</option>
	  					<option value="March">March</option>
					</select></Col>
					<Col ><select onChange={this.onYearChange} className="top-child year selector">
	  					<option value="2020" selected>2020</option>
	  					<option value="2021">2021</option>
	  					<option value="2022">2022</option>
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

				<div className='modal'>
					<Modal show={show} onHide={this.toggleShow}>
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>Select Call Type</Modal.Title>
       	 				</Modal.Header>
        				<Form>
        					<Modal.Body>
        					<Form.Group required controlId="formBasicRadio">
      							<Form.Check type='radio' id={1} label={"1st Call Day"}/>
      							<Form.Check type='radio' id={2} label={"1st Call Night"}/>
      							<Form.Check type='radio' id={3} label={"1st Call"}/>
      							<Form.Check type='radio' id={4} label={"2nd Call Day"}/>
      							<Form.Check type='radio' id={5} label={"2nd Call Night"}/>
      							<Form.Check type='radio' id={6} label={"2nd Call"}/>
      							<Form.Check type='radio' id={7} label={"COVID am"}/>
      							<Form.Check type='radio' id={8} label={"COVID pm"}/>
      							<Form.Check type='radio' id={9} label={"COVID x 24"}/>
  							</Form.Group>
        				</Modal.Body>
        				<Modal.Footer>
          					<Button variant="secondary" onClick={this.toggleShow}>
            					Close
          					</Button>
          					 <Button type="submit" variant="primary" onClick={this.toggleShow}>
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