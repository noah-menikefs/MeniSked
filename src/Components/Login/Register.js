import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
			code: ''		}
	}

	render(){
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
								<Form.Control required type="text" placeholder="First Name" />
							</Form.Group>
							<Form.Group controlId="formBasicLName">
								<Form.Control required type="text" placeholder="Last Name" />
							</Form.Group>
							<Form.Group controlId="formBasicEmail">
							    <Form.Control required type="email" placeholder="Email" />
							</Form.Group>
							<Form.Group controlId="formBasicPassword">
								<Form.Control required type="password" placeholder="Password" />
							</Form.Group>
							<Form.Group controlId="formBasicCPassword">
								<Form.Control required type="password" placeholder="Confirm Password" />
							</Form.Group>
							<Form.Group controlId="formBasicCode">
								<Form.Control required type="text" placeholder="Department Code" />
							</Form.Group>
							<Button onClick={() => console.log('login click')} id='loginButton' variant="primary" type="submit">
								Register
							</Button>
						</Form>
					</div>
					<div className='shad spacing' id='loginFooter'>
						<p>Already a user? <span onClick={() => console.log('register click')} className='label'>Login</span></p>
					</div>
				</div>
			</div>
		);
	}

}


export default Register;