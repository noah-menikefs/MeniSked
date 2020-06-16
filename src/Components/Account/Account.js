import React from 'react';
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

	render(){
		return(

			<div>
				<div className='accountInfo'>
					<h5 id='text'>Email Address</h5>
					<input type='email' name='email'/>
					<h5 id='text'>First Name</h5>
					<input type='text' name='first'/>
					<h5 id='text'>Last Name</h5>
					<input type='text' name='last'/>
				</div>
				<div className='changePass'>
					<h2 id='header'>Change Password</h2>
					<h5 id='text'>Current Password</h5>
					<input type='password' name='cp'/>
					<h5 id='text'>New Password</h5>
					<input type='password' name='np'/>
					<h5 id='text'>Confirm New Password</h5>
					<input type='password' name='cnp'/>
				</div>

				<input class="btn btn-primary" type="submit" value="Submit" id='submit'/>

			</div>

		);

	}

}

export default Account;