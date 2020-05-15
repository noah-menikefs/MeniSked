import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
			
			<div>
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
						<Form.Label onClick={() => console.log('forgot password click')} id="pLabel">Forgot Password?</Form.Label>
					</Form.Group>
				</Form>
			</div>

		);
	}

}


export default Login;