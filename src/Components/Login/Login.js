import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Logo from '../../logo512.png';
import './Login.css';


class Login extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			loginEmail: '',
			loginPassword: ''
		}
	}

	render(){
		return(
			<div >
				<div className='test shadow-2'>
					<div className='mt-5 spacing'id='loginHeader'>
						<img style={{paddingTop:'5px', height:90, width:90}} alt='Logo' src={Logo}/> 
						<h1 id='title'>MeniSked</h1>
					</div>
					<div className='justify-content-center'id='loginBody'>
						<Form className="login-form">
							<h1 id="loginTitle">Login</h1>
							<Form.Group controlId="formBasicEmail">
							    <Form.Control type="email" placeholder="Email" />
							  </Form.Group>

							<Form.Group controlId="formBasicPassword">
								<Form.Control type="password" placeholder="Password" />
							</Form.Group>
							<Button onClick={() => console.log('login click')} id='loginButton' variant="primary" type="submit">
								Login
							</Button>
							<Form.Group>
								<Form.Label onClick={() => console.log('forgot password click')} className="mt-3 label">Forgot Password?</Form.Label>
							</Form.Group>
						</Form>
					</div>
					<div className='shad spacing' id='loginFooter'>
						<p>New User? <span onClick={() => console.log('register click')} className='label'>Register Now</span></p>
					</div>
				</div>
			</div>

		);
	}

}


export default Login;