import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Scroll from './../Scroll/Scroll'
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
			currentHoliday: '',
			add: false
		}
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
				this.setState({currentHoliday: e.target.parentNode.id});
			}
		}
		this.setState({newRshow: !this.state.newRshow});
	}

	toggleSShow = (e) => {
		if (typeof e !== 'undefined'){
			this.setState({currentHoliday: e.target.parentNode.id});
		}
		this.setState({sShow: !this.state.sShow});
	}

	addModal = () => {
		if (this.state.add === true){
			return <Form.Control required type="text" placeholder="Name" />;
		}
		return <h5>{this.state.currentHoliday}</h5>;
	}

	render(){
		const {newNRshow, newRshow, sShow, currentHoliday} = this.state;
		return(
			<div className="body">
				<div className="left">
					
					<div className="top">
						<h4 className="subtitle">Recurring Holidays</h4>
						<Button className="add" onClick={this.toggleRShow} variant="primary">Add Recurring Holiday</Button>
					</div>
					<Scroll>
						<ul className="">
							<li id="New Year's Day">
								New Year's Day 
								<Button onClick={this.toggleRShow} className="edit butn" size="sm" variant="secondary">Edit</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li id="MLK Day">
								MLK Day 
								<Button onClick={this.toggleRShow} className="edit butn" size="sm" variant="secondary">Edit</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li id="Christmas Day">
								Christmas Day 
								<Button onClick={this.toggleRShow} className="edit butn" size="sm" variant="secondary">Edit</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>

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
							<li id="Party">
								Party
								<Button onClick={this.toggleSShow} className="sked butn" size="sm" variant="secondary">Schedule</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li id="Easter">
								Easter
								<Button onClick={this.toggleSShow} className="sked butn" size="sm" variant="secondary">Schedule</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li id="Cycle 4 St. Joes">
								Cycle 4 St. Joes
								<Button onClick={this.toggleSShow} className="sked butn" size="sm" variant="secondary">Schedule</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>


						</ul>
					</Scroll>
				</div>
				<div className='modal'>
					<Modal show={newNRshow} onHide={this.toggleNRShow} onSubmit={this.toggleNRShow}>
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>Add Non-recurring Holiday</Modal.Title>
       	 				</Modal.Header>
        				<Form>
        					<Modal.Body>
        					<Form.Group >
      							 <Form.Control required type="text" placeholder="Name" />
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
					<Modal show={newRshow} onHide={this.toggleRShow} onSubmit={this.toggleRShow}>
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
								<Form.Control as="select">
							    	<option>January</option>
							    	<option>February</option>
							    	<option>March</option>
							    	<option>April</option>
							    	<option>May</option>
							    </Form.Control>
							</Form.Group>
							<Form.Group >
								<Form.Label>Day of the Month</Form.Label>
							    <Form.Control as="select">
							    	<option>1</option>
							    	<option>2</option>
							    	<option>3</option>
							    	<option>4</option>
							    	<option>5</option>
							    </Form.Control>
							</Form.Group>
							<Form.Group id="activeCheck" controlId="formBasicCheckbox">
						    	<Form.Check type="checkbox" label="Active"/>
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
        						<h3>{currentHoliday}</h3>
        					</Form.Group>
        					<Form.Group >
        						<Form.Label>Year</Form.Label>
								<Form.Control as="select">
							    	<option>2020</option>
							    	<option>2021</option>
							    	<option>2022</option>
							    	<option>2023</option>
							    	<option>2024</option>
							    </Form.Control>
  							</Form.Group>
  							<Form.Group >
								<Form.Label>Month</Form.Label>
								<Form.Control as="select">
							    	<option>January</option>
							    	<option>February</option>
							    	<option>March</option>
							    	<option>April</option>
							    	<option>May</option>
							    </Form.Control>
							</Form.Group>
							<Form.Group >
								<Form.Label>Day of the Month</Form.Label>
							    <Form.Control as="select">
							    	<option>1</option>
							    	<option>2</option>
							    	<option>3</option>
							    	<option>4</option>
							    	<option>5</option>
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