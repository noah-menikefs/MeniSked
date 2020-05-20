import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Logo from '../../logo512.png';
import './Login.css';

class Login extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			loginEmail: '',
			loginPassword: '',
			show: false,
			errorShow: false,
			msg: ''
		}
	}

	onEmailChange = (event) => {
		this.setState({loginEmail: event.target.value})
	}

	onPasswordChange = (event) => {
		this.setState({loginPassword: event.target.value})
	}


	toggleShow = () => {
		this.setState({show: !this.state.show})
	}

	toggleErrorShow = (type) => {
		if (type === 'fp'){
			this.setState({msg: 'Please input your email address.'})
		}
		else{
			this.setState({msg: 'Sorry, the email address or password you entered does not match our records.'})
		}

		this.setState({errorShow: !this.state.errorShow})
	}

	modalChoose = () => {
		if (this.state.loginEmail.length > 0){
			this.toggleShow();
		}
		else{
			this.toggleErrorShow('fp');
		}
	}
	

	render(){
		const {show, loginEmail, errorShow, msg} = this.state;
		return(
			<div>
				<div className='test shadow-2'>
					<div className='mt-5 spacing'id='loginHeader'>
						<img style={{paddingTop:'5px', height:90, width:90}} alt='Logo' src={Logo}/> 
						<h1 id='title'>MeniSked</h1>
					</div>
					<div className='justify-content-center'id='loginBody'>
						<Form className="login-form">
							<h1 id="loginTitle">Login</h1>
							<Form.Group controlId="formBasicEmail">
							    <Form.Control onChange={this.onEmailChange} required type="email" placeholder="Email" />
							  </Form.Group>

							<Form.Group controlId="formBasicPassword">
								<Form.Control onChange={this.onPasswordChange} type="password" placeholder="Password" />
							</Form.Group>
							<Button onClick={() => console.log('login click')} id='loginButton' variant="primary" type="submit">
								Login
							</Button>
							<Form.Group>
								<Form.Label onClick={this.modalChoose} className="mt-3 label">Forgot Password?</Form.Label>
							</Form.Group>
						</Form>
					</div>
					<div className='shad spacing' id='loginFooter'>
						<p>New user? <span onClick={() => console.log('register click')} className='label'>Register Now</span></p>
					</div>
				</div>
				<div className='modal'>
					<Modal show={show} onHide={this.toggleShow}>
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>Forgot Password</Modal.Title>
       	 				</Modal.Header>
        				<Modal.Body>
        					A temporary password has been sent to {loginEmail}. Once you have signed in please change your password in the account tab.
        				</Modal.Body>
        				<Modal.Footer>
          					<Button variant="secondary" onClick={this.toggleShow}>
            					Close
          					</Button>
	        			</Modal.Footer>
      				</Modal>
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
			</div>

		);
	}

}


export default Login;