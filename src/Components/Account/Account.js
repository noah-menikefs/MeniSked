import React from 'react';
import './Account.css';


class Account extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			email: '',
			firstName: '',
			lastName: '',
			cPassword: '',
			nPassword: '',
			cNPassword: '',
		}
	}

	render(){
		return(

			<div>
				<div className='accountInfo'>
					<h5 id='text'>Email Address</h5>
					<input type='email' value={this.state.email}/>
					<h5 id='text'>First Name</h5>
					<input type='name' value={this.state.firstName}/>
					<h5 id='text'>Last Name</h5>
					<input type='name' value={this.state.lastName}/>
				</div>
				<div className='changePass'>
					<h2 id='header'>Change Password</h2>
					<h5 id='text'>Current Password</h5>
					<input type='password' value={this.state.cPassword}/>
					<h5 id='text'>New Password</h5>
					<input type='password' value={this.state.nPassword}/>
					<h5 id='text'>Confirm New Password</h5>
					<input type='password' value={this.state.cNPassword}	/>
				</div>

				<input type='submit' name='submit' id='submit'/>

			</div>

		);

	}

}

export default Account;