import React from 'react';
import Button from 'react-bootstrap/Button';
import Scroll from './../Scroll/Scroll'
import Form from 'react-bootstrap/Form'
import './Settings.css';

class People extends React.Component{
	constructor(){
		super();
		this.state = {
			peopleList: [


			],
			fName: '',
			lName: '',
			email: '',
			tPassword: '',
			message: ''
		}
	}

	render(){
			return(
			<div className="body">
				<div className="left">
					
					<div className="top">
						<h4 className="subtitle">Staff List</h4>
					</div>
					<Scroll>
						<ul className="">
							<li>
								Alpha, Joe
								<input className='inp' onInput={() => console.log("click")} type="checkbox" />
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li>
								Burton, Tim
								<input className='inp' onInput={() => console.log("click")} type="checkbox" />
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li>
								Menikefs, Noah 
								<input className='inp' onInput={() => console.log("click")} type="checkbox" />
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>

						</ul>
					</Scroll>

				</div>
				<div className="p right">
					<div className="top">
						<h4 className="subtitle">Add User</h4>
					</div>
					<Form id="callForm">
						<div id="box" style={{border:'2px solid black', height: '400px'}}>
							<Form.Group id="name">
								<Form.Control required type="text" placeholder="First Name" />
							</Form.Group>
							<Form.Group id="name">
								<Form.Control required type="text" placeholder="Last Name" />
							</Form.Group>
							<Form.Group id="email" controlId="formBasicEmail">
    							<Form.Control required type="email" placeholder="Email" />
  							</Form.Group>
  							<Form.Group id="pword" controlId="formBasicPassword">
    							<Form.Control required type="password" placeholder="Temporary Password" />
						  </Form.Group>
						  <Form.Group controlId="exampleForm.ControlTextarea1">
    						<Form.Control id="message" as="textarea" rows="6" placeholder="Message"/>
  							</Form.Group>
						</div>
						<div className="bottom">
							<Button id='callSub' variant="primary" type="submit">
								Submit
							</Button>
						</div>
					</Form>


				</div>
			</div>

		);



	}


}

export default People;