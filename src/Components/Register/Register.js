import React from 'react';

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

			<p>Register</p>
		);
	}

}


export default Register;