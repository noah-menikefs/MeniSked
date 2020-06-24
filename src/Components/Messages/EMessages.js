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
			msg: ''
		}
	}

	toggleShow = (route) => {
	    this.setState({ 
			show: !this.state.show,
		    msg: route
	   	});
	 };


	render(){
		const {show, msg} = this.state;
		return(
			<div>
				<div className='listStyleE'>
					<ListGroup horizontal>
						<ListGroup.Item action disabled>
							Peter Menikefs <p className='accepted'>accepted</p> your request for 1st call on July 17, 2020
						</ListGroup.Item>
						<ListGroup.Item>06/24/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item action disabled>
							Peter Menikefs <p className='accepted'>accepted</p> your request for vacation from July 2, 2020 --> July 6, 2020
						</ListGroup.Item>
						<ListGroup.Item>06/17/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item action onClick={() => this.toggleShow("Sorry, I can't let you work that day.")}>
							Peter Menikefs <p className='denied'>denied</p> your request for 2nd call on August 3, 2020
						</ListGroup.Item>
						<ListGroup.Item>05/29/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item action disabled>
							Peter Menikefs <p className='accepted'>accepted</p> your request for 1st call on June 30, 2020
						</ListGroup.Item>
						<ListGroup.Item>04/22/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item action onClick={() => this.toggleShow("Sorry, I can't let you go on vacation then.")}>
							Peter Menikefs <p className='denied'>denied</p> your request for vacation from September 3, 2020 --> September 10, 2020
						</ListGroup.Item>
						<ListGroup.Item>01/08/2020</ListGroup.Item>
					</ListGroup>
				</div>
				<div className='modal'>
					<Modal show={show} onHide={() => this.toggleShow('')}>
						<Modal.Header closeButton>
							<Modal.Title id='modalTitle'>Denied Request Explanation</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>{msg}</p>
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={() => this.toggleShow('')} variant="secondary" >
								Close
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
			</div>



		);



	}


}

export default EMessages;