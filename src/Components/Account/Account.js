import React from 'react';
import Button from 'react-bootstrap/button';
import './Account.css';


class Account extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			email: '',
			firstname: '',
			lastname: '',
			cPassword: '',
			nPassword: '',
			cNPassword: '',
		}
	}

	componentDidMount = () => {
		this.loadAccount();
	}

	loadAccount = () => {
		fetch('http://localhost:3000/account/'+this.props.user.id)
			.then(response => response.json())
			.then(user => this.setState({
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname
			}));
	}

	onEmailChange = (event) => {
		this.setState({email: event.target.value})
	}
	
	onFNameChange = (event) => {
		this.setState({firstname: event.target.value})
	}

	onLNameChange = (event) => {
		this.setState({lastname: event.target.value})
	}

	onCPasswordChange = (event) => {
		this.setState({cPassword: event.target.value})
	}

	onNPasswordChange = (event) => {
		this.setState({nPassword: event.target.value})
	}

	onCNPasswordChange = (event) => {
		this.setState({cNPassword: event.target.value})
	}

	onSubmitBasic = () => {
		if (
			this.state.firstname.length > 0 && 
			this.state.lastname.length > 0 &&
			this.props.validateEmail(this.state.email)
		){
			
			fetch('http://localhost:3000/account/'+this.props.user.id, {
				method: 'put',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					email: this.state.email,
					firstname: this.state.firstname,
					lastname: this.state.lastname
				})
			})
				.then(response => response.json())
				.then(user => {
					if (user.email){
						this.setState({
							email: user.email,
							firstname: user.firstname,
							lastname: user.lastname
						})
						this.props.loadUser(user);
					}
				})
		}
	}

	onSubmitAll = () => {
		if(	
			this.state.cPassword.length > 0 && 
			this.state.nPassword.length > 0 &&
			this.state.nPassword === this.state.cNPassword
		){			
			fetch('http://localhost:3000/account/'+this.props.user.id, {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					oldPassword: this.state.cPassword,
					newPassword: this.state.nPassword
				})
			})
			this.onSubmitBasic();
			this.setState({
				cPassword: '',
				nPassword: '',
				cNPassword: ''
			})
		}
	}

	onSubmitChoose = () => {
		if (this.state.cPassword.length > 0){
			this.onSubmitAll();
		}
		else{
			this.onSubmitBasic();
		}
	}

	render(){
		return(

			<div>
				<div className='accountInfo'>
					<h5 id='text'>Email Address</h5>
					<input value={this.state.email} onChange={this.onEmailChange}  type='email' name='email' className='accountInp'/>
					<h5 id='text'>First Name</h5>
					<input value={this.state.firstname} onChange={this.onFNameChange} type='text' name='first' className='accountInp'/>
					<h5 id='text'>Last Name</h5>
					<input value={this.state.lastname} onChange={this.onLNameChange} type='text' name='last' className='accountInp'/>
				</div>
				<div className='changePass'>
					<h2 id='header'>Change Password</h2>
					<h5 id='text'>Current Password</h5>
					<input value={this.state.cPassword} onChange={this.onCPasswordChange} type='password' name='cp' className='accountInp'/>
					<h5 id='text'>New Password</h5>
					<input value={this.state.nPassword} onChange={this.onNPasswordChange} type='password' name='np' className='accountInp'/>
					<h5 id='text'>Confirm New Password</h5>
					<input value={this.state.cNPassword} onChange={this.onCNPasswordChange} type='password' name='cnp' className='accountInp'/>
				</div>

				<Button onClick={this.onSubmitChoose} id="submit" variant="primary">Submit</Button>

			</div>

		);

	}

}

export default Account;