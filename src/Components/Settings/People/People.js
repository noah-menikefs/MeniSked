import React from 'react';

class People extends React.Component{
	constructor(){
		super();
		this.state = {
			peopleList: [


			],
			fName: '',
			lName: '',
			email: '',
			tPassword: '',
			message: ''
		}
	}

	render(){
		return(
			<p>People</p>




		);



	}


}

export default People;