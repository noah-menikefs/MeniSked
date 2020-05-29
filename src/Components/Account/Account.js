import React from 'react';
import './Account.css';


class Account extends React.Component {
	constructor(){
		super();
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
					<h5 className='text'>Email Address</h5>
					<input type='email' name='email'/>
					<h5 className='text'>First Name</h5>
					<input type='name' name='firstName'/>
					<h5 className='text'>Last Name</h5>
					<input type='name' name='lastName'/>
				</div>
				<div className='changePass'>
					<h2 className='header'>Change Password</h2>
					<h5 className='text'>Current Password</h5>
					<input type='password' name='cPassword'/>
					<h5 className='text'>New Password</h5>
					<input type='password' name='nPassword'/>
					<h5 className='text'>Confirm New Password</h5>
					<input type='password' name='cNPassword'/>
				</div>

				<input type='submit' name='submit' id='submit'/>

			</div>

		);

	}

}

export default Account;