import React from 'react';
import Button from 'react-bootstrap/Button';
import Scroll from './../Scroll/Scroll'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
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
			message: '',
			dShow: false,
			id: -1
		}
	}

	componentDidMount = () => {
		this.loadAllUsers();
	}

	loadAllUsers = () => {
		fetch('http://localhost:3000/people')
			.then(response => response.json())
			.then(users => this.setState({peopleList: users}));
	}

	addCall = () => {
		fetch('http://localhost:3000/people', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				firstName: this.state.fName,
				lastName: this.state.lName,
				email: this.state.email,
				password: this.state.tPassword,
				msg: this.state.message,
				department: this.props.department.replace(" Admin",'')
			})
		})
			.then(response => response.json())
			.then(person => {
				if (person){
					this.loadAllUsers();
				}
			})
		this.setState({
			fName: '',
			lName: '',
			email: '',
			tPassword: '',
			message: ''
		})
	}

	activeChange = (e) => {
		fetch('http://localhost:3000/people', {
			method: 'put',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				id: parseInt(e.target.parentNode.id,10),
				isActive: e.target.checked
			})
		})
			.then(response => response.json())
			.then(person => {
				if (person){
					this.loadAllUsers();
				}
			})
	}

	deletePerson = () => {
		fetch('http://localhost:3000/people', {
			method: 'delete',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				id: parseInt(this.state.id,10)
			})
		})
			.then(response => response.json())
			.then(people => {
				if (people){
					this.loadAllUsers();
				}
			})

		this.toggleDShow();
	}

	onFNameChange = (e) => {
		this.setState({fName: e.target.value})
	}

	onLNameChange = (e) => {
		this.setState({lName: e.target.value})
	}

	onEmailChange = (e) => {
		this.setState({email: e.target.value})
	}

	onPasswordChange = (e) => {
		this.setState({tPassword: e.target.value})
	}

	onMsgChange = (e) => {
		this.setState({message: e.target.value})
	}

	toggleDShow = (e) => {
		if (e){
			this.setState({id: parseInt(e.target.parentNode.id,10)})
		}
		else{
			this.setState({id: -1})
		}
		this.setState({dShow: !this.state.dShow})
	}

	render(){
		const {peopleList, fName, lName, email, tPassword, message, dShow} = this.state;

		let docList = [];
		for (let j = 0; j < peopleList.length; j++){
			docList.push(
				<li key={peopleList[j].id} id={peopleList[j].id}>
					{peopleList[j].lastName}, {peopleList[j].firstName}
					<input onChange={this.activeChange} checked={peopleList[j].isActive} key={j} className='inp' onInput={() => console.log("click")} type="checkbox" />
					<Button key={-j-1} onClick={this.toggleDShow} className="delete butn" size="sm" variant="danger">Delete</Button>
				</li>
			)
		}

			return(
			<div className="body">
				<div className="left">
					
					<div className="top">
						<h4 className="subtitle">Staff List</h4>
					</div>
					<Scroll>
						<ul className="">
							{docList}
						</ul>
					</Scroll>

				</div>
				<div className="p right">
					<div className="top">
						<h4 className="subtitle">Add User</h4>
					</div>
					<Form id="callForm" onSubmit={this.addCall}>
						<div id="box" style={{border:'2px solid black', height: '400px'}}>
							<Form.Group id="name">
								<Form.Control required value={fName} type="text" onChange={this.onFNameChange} placeholder="First Name" />
							</Form.Group>
							<Form.Group id="name">
								<Form.Control required value={lName} type="text" onChange={this.onLNameChange} placeholder="Last Name" />
							</Form.Group>
							<Form.Group id="email">
    							<Form.Control required value={email} type="email" onChange={this.onEmailChange} placeholder="Email" />
  							</Form.Group>
  							<Form.Group id="pword">
    							<Form.Control required value={tPassword} type="password" onChange={this.onPasswordChange} placeholder="Temporary Password" />
						  </Form.Group>
						  <Form.Group >
    						<Form.Control id="message" as="textarea" value={message} onChange={this.onMsgChange} rows="6" placeholder="Message"/>
  							</Form.Group>
						</div>
						<div className="bottom">
							<Button id='callSub' variant="primary" type="submit">
								Submit
							</Button>
						</div>
					</Form>


				</div>
				<div className='modal'>
					<Modal show={dShow} onHide={this.toggleDShow} onSubmit={this.deletePerson}>
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>Confirm Deletion</Modal.Title>
       	 				</Modal.Header>
        				<Form>
        					<Modal.Body>
        					<Form.Group >
      							 <Form.Label>Are you sure you want to delete this user?</Form.Label>
  							</Form.Group>
        				</Modal.Body>
        				<Modal.Footer>
          					<Button onClick={this.toggleDShow} variant="secondary" >
            					Cancel
          					</Button>
          					 <Button type="submit" variant="primary" >
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

export default People;