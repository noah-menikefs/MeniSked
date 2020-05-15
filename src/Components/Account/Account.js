import React from 'react';


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

			<p>Account</p>



		);

	}

}

export default Account;