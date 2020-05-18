import React from 'react';
import Button from 'react-bootstrap/Button';
import Scroll from '../../Scroll/Scroll'
import Form from 'react-bootstrap/Form'
import './CallTypes.css';

class CallTypes extends React.Component{
	constructor(){
		super();
		this.state = {
			priorityList: [


			],
			callName: '',
			priority: '',
			isActive: false
		}
	}

	render(){
		return(
			<div className="body">
				<div className="left">
					
					<div className="top">
						<h4 className="subtitle">Priority List</h4>
						<Button variant="primary">Add Call Type</Button>
					</div>
					<Scroll>
						<ol className="">
							<li>
								1st Call Day 
								<Button onClick={() => console.log("click")} className="edit butn" size="sm" variant="secondary">Edit</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li>
								1st Call Night
								<Button onClick={() => console.log("click")} className="edit butn" size="sm" variant="secondary">Edit</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li>
								2nd Call Day 
								<Button onClick={() => console.log("click")} className="edit butn" size="sm" variant="secondary">Edit</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>

						</ol>
					</Scroll>

				</div>
				<div className="right">
					<div className="top">
						<h4 className="subtitle">Add/Edit Calls</h4>
					</div>
					<div id="box" style={{border:'2px solid black', height: '200px'}}>
						<Form id="callForm">
							<Form.Group id="name">
								<Form.Control required type="text" placeholder="Name" />
							</Form.Group>
							<Form.Group id="priority" controlId="exampleForm.ControlSelect1">
    							<Form.Label>Priority</Form.Label>
   								<Form.Control as="select">
	   								<option>1</option>
	   								<option>2</option>
	   								<option>3</option>
	   								<option>4</option>
	   								<option>5</option>
   				 				</Form.Control>
  							</Form.Group> 
						  <Form.Group id="activeCheck" controlId="formBasicCheckbox">
						    <Form.Check type="checkbox" label="Active" />
						  </Form.Group>
						</Form>
					</div>
					<div className="bottom">
						<Button id='callSub' variant="secondary" type="cancel">
							Cancel
						</Button>
						<Button id='callSub' variant="primary" type="submit">
							Submit
						</Button>
					</div>


				</div>
			</div>



		);



	}


}

export default CallTypes;