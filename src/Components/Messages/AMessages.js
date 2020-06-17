import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import './Messages.css';


class AMessages extends React.Component{
	constructor(){
		super();
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
				<h4>Requests</h4>

				<div className="listStyleA">

					<ListGroup horizontal>
						<ListGroup.Item><p>Noah Menikefs has requested vacation from May 15, 2020 --> May 20, 2020</p>
						  	<Button variant="success">Accept</Button>
						  	<Button variant="danger" onClick={this.showModal}>Deny</Button>
						  	<Modal show={this.state.show} handleClose={this.hideModal}>
						  		<Modal.Header closeButton>
						  			<Modal.Title>Denied Request Explanation</Modal.Title>
						  		</Modal.Header>
						  		<Modal.Body>
						  			<input required type='text' className='explanation'/>
						  		</Modal.Body>
						  		<Modal.Footer>
						  	    	<Button variant="secondary" onClick={this.hideModal}>Close</Button>
						  	    	<Button variant="primary" onClick={this.hideModal}>Submit Response</Button>
					  			</Modal.Footer>
							</Modal>
						</ListGroup.Item>
						<ListGroup.Item>1 day ago</ListGroup.Item>
					</ListGroup>


					<ListGroup horizontal>
						<ListGroup.Item><p>Nikhil Ismail has requested 2nd call from June 1, 2020 - June 3, 2020</p>
						  	<Button variant="success">Accept</Button>
						  	<Button variant="danger" onClick={this.showModal}>Deny</Button>
						  	<Modal show={this.state.show} handleClose={this.hideModal}>
						  		<Modal.Header closeButton>
						  			<Modal.Title>Denied Request Explanation</Modal.Title>
						  		</Modal.Header>
						  		<Modal.Body>
						  			<input required type='text' className='explanation'/>
						  		</Modal.Body>
						  		<Modal.Footer>
						  	    	<Button variant="secondary" onClick={this.hideModal}>Close</Button>
						  	    	<Button variant="primary" onClick={this.hideModal}>Submit Response</Button>
					  			</Modal.Footer>
							</Modal>
						</ListGroup.Item>
						<ListGroup.Item>4 days ago</ListGroup.Item>
					</ListGroup>


					<ListGroup horizontal>
						<ListGroup.Item><p>Paul Miskew has requested 1st call from May 28, 2020 - May 30, 2020</p>
						  	<Button variant="success">Accept</Button>
						  	<Button variant="danger" onClick={this.showModal}>Deny</Button>
						  	<Modal show={this.state.show} handleClose={this.hideModal}>
						  		<Modal.Header closeButton>
						  			<Modal.Title>Denied Request Explanation</Modal.Title>
						  		</Modal.Header>
						  		<Modal.Body>
						  			<input required type='text' className='explanation'/>
						  		</Modal.Body>
						  		<Modal.Footer>
						  	    	<Button variant="secondary" onClick={this.hideModal}>Close</Button>
						  	    	<Button variant="primary" onClick={this.hideModal}>Submit Response</Button>
					  			</Modal.Footer>
							</Modal>
						</ListGroup.Item>
						<ListGroup.Item>1 week ago</ListGroup.Item>
					</ListGroup>


					<ListGroup horizontal>
						<ListGroup.Item><p>Noah Menikefs has requested vacation from December 15, 2020 --> December 27, 2020</p>
						  	<Button variant="success">Accept</Button>
						  	<Button variant="danger" onClick={this.showModal}>Deny</Button>
						  	<Modal show={this.state.show} handleClose={this.hideModal}>
						  		<Modal.Header closeButton>
						  			<Modal.Title>Denied Request Explanation</Modal.Title>
						  		</Modal.Header>
						  		<Modal.Body>
						  			<input required type='text' className='explanation'/>
						  		</Modal.Body>
						  		<Modal.Footer>
						  	    	<Button variant="secondary" onClick={this.hideModal}>Close</Button>
						  	    	<Button variant="primary" onClick={this.hideModal}>Submit Response</Button>
					  			</Modal.Footer>
							</Modal>
						</ListGroup.Item>
						<ListGroup.Item> 3 weeks ago</ListGroup.Item>
					</ListGroup>
					

				</div>


			</div>

		);



	}


}

export default AMessages;