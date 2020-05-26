import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Logo from '../../logo512.png';
import './Login.css';

class Register extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			lastName: '',
			firstName: '',
			email: '',
			password: '',
			cPassword: '',
			code: '',
			errorShow: false,
			msg: ''

		}
	}

	onEmailChange = (event) => {
		this.setState({email: event.target.value})
	}

	onPasswordChange = (event) => {
		this.setState({password: event.target.value})
	}

	onCPasswordChange = (event) => {
		this.setState({cPassword: event.target.value})
	}

	onCodeChange = (event) => {
		this.setState({code: event.target.value})
	}

	onFNameChange = (event) => {
		this.setState({firstName: event.target.value})
	}

	onLNameChange = (event) => {
		this.setState({lastName: event.target.value})
	}

	onSubmitRegister = () => {
		if (this.state.password !== this.state.cPassword){
			this.toggleErrorShow('dp');
			return false;
		}
		let isAdmin = false;
		fetch('http://localhost:3000/register', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				department: this.state.code,
				isAdmin: isAdmin
			})
		})
			.then(response => response.json())
			.then(user => {
				if (user){
					this.props.loadUser(user)
					this.props.onRouteChange("Personal Schedule");
				}
			})
	}

	toggleErrorShow = (type) => {
		if (type === 'dp'){
			this.setState({msg: 'The passwords you entered do not match.'})
		}
		this.setState({errorShow: !this.state.errorShow})
	}

	render(){
		const {errorShow, msg} = this.state;
		const {onRouteChange} = this.props;
		return(
			<div>
				<div className='test shadow-2'>
					<div className='mt-3 spacing'id='loginHeader'>
						<img style={{paddingTop:'5px', height:90, width:90}} alt='Logo' src={Logo}/> 
						<h1 id='title'>MeniSked</h1>
					</div>
					<div className='justify-content-center'id='loginBody'>
						<Form className="login-form">
							<h1 id="loginTitle">Register</h1>
							<Form.Group controlId="formBasicFName">
								<Form.Control required onChange={this.onFNameChange} type="text" placeholder="First Name" />
							</Form.Group>
							<Form.Group controlId="formBasicLName">
								<Form.Control required onChange={this.onLNameChange} type="text" placeholder="Last Name" />
							</Form.Group>
							<Form.Group controlId="formBasicEmail">
							    <Form.Control required onChange={this.onEmailChange} type="email" placeholder="Email" />
							</Form.Group>
							<Form.Group controlId="formBasicPassword">
								<Form.Control required onChange={this.onPasswordChange} type="password" placeholder="Password" />
							</Form.Group>
							<Form.Group controlId="formBasicCPassword">
								<Form.Control required onChange={this.onCPasswordChange} type="password" placeholder="Confirm Password" />
							</Form.Group>
							<Form.Group controlId="formBasicCode">
								<Form.Control required onChange={this.onCodeChange} type="text" placeholder="Department Code" />
							</Form.Group>
							<Button onClick={this.onSubmitRegister} type="submit" id='loginButton' variant="primary" >
								Register
							</Button> 
						</Form>
					</div>
					<div className='modal'>
					<Modal show={errorShow} onHide={this.toggleErrorShow}>
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>Error</Modal.Title>
       	 				</Modal.Header>
        				<Modal.Body>
        					{msg}
        				</Modal.Body>
        				<Modal.Footer>
          					<Button variant="secondary" onClick={this.toggleErrorShow}>
            					Close
          					</Button>
	        			</Modal.Footer>
      				</Modal>
				</div>
					<div className='shad spacing' id='loginFooter'>
						<p>Already a user? <span onClick={() => onRouteChange("Login", false)} className='label'>Login</span></p>
					</div>
				</div>
			</div>
		);
	}

}


export default Register;