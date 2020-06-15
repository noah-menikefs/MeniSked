import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import './Messages.css';

class EMessages extends React.Component{
	constructor(props){
		super(props);
		this.vacationClick = this.vacationClick.bind(this);
		this.callClick = this.callClick.bind(this);
		this.state = {
			status: ''
		}
	}

	vacationClick() {
	     alert("Sorry, I can't let you go on vacation during this time");
	}

	callClick() {
	     alert("Sorry, I can't let you work this day");
	}


	render(){
		return(

			<div>

				<ListGroup>
					<ListGroup.Item>
					<div className='content'>
					Peter Menikefs <p id='accepted'>accepted</p> your request for 1st call on July 17, 2020
					</div>
					<div className='counter'>
					4 days ago
					</div>
					</ListGroup.Item>

					<ListGroup.Item>
					<div className='content'>
					Peter Menikefs <p id='accepted'>accepted</p> your request for vacation from July 2, 2020 --> July 6, 2020
					</div>
					<div className='counter'>
					1 week ago
					</div>
					</ListGroup.Item>

					<ListGroup.Item action onClick={this.callClick}>
					<div className='content'>
					Peter Menikefs <p id='denied'>denied</p> your request for 2nd call on August 3, 2020
					</div>
					<div className='counter'>
					3 weeks ago
					</div>
					</ListGroup.Item>

					<ListGroup.Item>
					<div className='content'>
					Peter Menikefs <p id='accepted'>accepted</p> your request for 1st call on June 30, 2020
					</div>
					<div className='counter'>
					2 months ago
					</div>
					</ListGroup.Item>

					<ListGroup.Item action onClick={this.vacationClick}>
					<div className='content'>
					Peter Menikefs <p id='denied'>denied</p> your request for vacation from September 3, 2020 --> September 10, 2020
					</div>
					<div className='counter'>
					1 year ago
					</div>
					</ListGroup.Item>
				</ListGroup>

			</div>



		);



	}


}

export default EMessages;