import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import './Messages.css';

class EMessages extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			status: ''
		}
	}

	render(){
		return(

			<div>

				<div className='text'>
					<ListGroup>
						<ListGroup.Item>Peter Menikefs <p id='accepted'>accepted</p> your request for 1st call on July 17, 2020</ListGroup.Item>
						<ListGroup.Item>Peter Menikefs <p id='accepted'>accepted</p> your request for vacation from July 2, 2020 --> July 6, 2020</ListGroup.Item>
						<ListGroup.Item>Peter Menikefs <p id='denied'>denied</p> your request for 2nd call on August 3, 2020</ListGroup.Item>
						<ListGroup.Item>Peter Menikefs <p id='accepted'>accepted</p> your request for 1st call on June 30, 2020</ListGroup.Item>
						<ListGroup.Item>Peter Menikefs <p id='denied'>denied</p> your request for vacation from September 3, 2020 --> September 10, 2020</ListGroup.Item>
					</ListGroup>
				</div>


			</div>



		);



	}


}

export default EMessages;