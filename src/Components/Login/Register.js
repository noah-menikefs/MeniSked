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

	toggleErrorShow = (type) => {
		if (type === 'dp'){
			this.setState({msg: 'The passwords you entered do not match.'})
		}
		this.setState({errorShow: !this.state.errorShow})
	}

	errDetect = () => {
		if (this.state.password !== this.state.cPassword){
			this.toggleErrorShow('dp');
		}
		return false;
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
						<Form className="login-form" onsubmit={this.errDetect}>
							<h1 id="loginTitle">Register</h1>
							<Form.Group controlId="formBasicFName">
								<Form.Control required type="text" placeholder="First Name" />
							</Form.Group>
							<Form.Group controlId="formBasicLName">
								<Form.Control required type="text" placeholder="Last Name" />
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
								<Form.Control required type="text" placeholder="Department Code" />
							</Form.Group>
							<Button type="submit" id='loginButton' variant="primary" >
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