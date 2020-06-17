import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import './Messages.css';

class EMessages extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			show: false,
		}
	}

	showModal = () => {
	    this.setState({ show: true });
	 };

	hideModal = () => {
	    this.setState({ show: false });
	 };


	render(){
		return(

			<div>

				<div className='listStyleE'>

					<ListGroup horizontal>
						<ListGroup.Item action disabled>
						Peter Menikefs <p className='accepted'>accepted</p> your request for 1st call on July 17, 2020
						</ListGroup.Item>
						<ListGroup.Item>4 days ago</ListGroup.Item>
					</ListGroup>

					<ListGroup horizontal>
						<ListGroup.Item action disabled>
						Peter Menikefs <p className='accepted'>accepted</p> your request for vacation from July 2, 2020 --> July 6, 2020
						</ListGroup.Item>
						<ListGroup.Item>1 week ago</ListGroup.Item>
					</ListGroup>

					<ListGroup horizontal>
						<ListGroup.Item action onClick={this.showModal}>
					  	<Modal show={this.state.show} handleClose={this.hideModal}>
					  		<Modal.Header closeButton>
					  			<Modal.Title>Denied Request Explanation</Modal.Title>
					  		</Modal.Header>
					  		<Modal.Body>Sorry, I can't let you work then</Modal.Body>
					  		<Modal.Footer>
					  	    	<Button variant="primary" onClick={this.hideModal}>Close</Button>
				  			</Modal.Footer>
						</Modal>
						Peter Menikefs <p className='denied'>denied</p> your request for 2nd call on August 3, 2020
						</ListGroup.Item>
						<ListGroup.Item>3 weeks ago</ListGroup.Item>
					</ListGroup>

					<ListGroup horizontal>
						<ListGroup.Item action disabled>
						Peter Menikefs <p className='accepted'>accepted</p> your request for 1st call on June 30, 2020
						</ListGroup.Item>
						<ListGroup.Item>2 months ago</ListGroup.Item>
					</ListGroup>

					<ListGroup horizontal>
						<ListGroup.Item action onClick={this.showModal}>
					  	<Modal show={this.state.show} handleClose={this.hideModal}>
					  		<Modal.Header closeButton>
					  			<Modal.Title>Denied Request Explanation</Modal.Title>
					  		</Modal.Header>
					  		<Modal.Body>Sorry, I can't let you go on vacation then</Modal.Body>
					  		<Modal.Footer>
					  	    	<Button variant="primary" onClick={this.hideModal}>Close</Button>
				  			</Modal.Footer>
						</Modal>
						Peter Menikefs <p className='denied'>denied</p> your request for vacation from September 3, 2020 --> September 10, 2020
						</ListGroup.Item>
						<ListGroup.Item>5 months ago</ListGroup.Item>
					</ListGroup>

				</div>


			</div>



		);



	}


}

export default EMessages;