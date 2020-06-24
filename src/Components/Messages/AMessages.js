import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './Messages.css';


class AMessages extends React.Component{
	constructor(){
		super();
		this.state = {
			show: false,
			msg: ''
		}
	}

	toggleShow = () => {
		this.setState({
			show: !this.state.show,
			msg: ''
		});
	}

	onMsgChange = (event) => {
		this.setState({msg: event.target.value});
	}

	render(){
		const {show} = this.state;
		return(
			<div>
				<h4>Requests</h4>
				<div className="listStyleA">
					<ListGroup horizontal>
						<ListGroup.Item action><p>Noah Menikefs has requested vacation from May 15, 2020 --> May 20, 2020</p>
						  	<Button variant="success">Accept</Button>
						  	<Button variant="danger" onClick={this.toggleShow}>Deny</Button>
						</ListGroup.Item>
						<ListGroup.Item>1 day ago</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item action><p>Nikhil Ismail has requested 2nd call from June 1, 2020 - June 3, 2020</p>
						  	<Button variant="success">Accept</Button>
						  	<Button variant="danger" onClick={this.toggleShow}>Deny</Button>
						</ListGroup.Item>
						<ListGroup.Item>4 days ago</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item action><p>Paul Miskew has requested 1st call from May 28, 2020 - May 30, 2020</p>
						  	<Button variant="success">Accept</Button>
						  	<Button variant="danger" onClick={this.toggleShow}>Deny</Button>
						</ListGroup.Item>
						<ListGroup.Item>1 week ago</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item action><p>Noah Menikefs has requested vacation from December 15, 2020 --> December 27, 2020</p>
						  	<Button variant="success">Accept</Button>
						  	<Button variant="danger" onClick={this.toggleShow}>Deny</Button>
						</ListGroup.Item>
						<ListGroup.Item> 3 weeks ago</ListGroup.Item>
					</ListGroup>
				</div>
				<div className='modal'>
					<Modal show={show} onHide={this.toggleShow}>
        				<Modal.Header closeButton>
          					<Modal.Title id='modalTitle'>Denied Request Explanation</Modal.Title>
       	 				</Modal.Header>
        				<Form>
        					<Modal.Body>
	        					<Form.Group controlId="exampleForm.ControlTextarea1">
	    							<Form.Control onChange={this.onMsgChange} as="textarea" rows="4" />
	  							</Form.Group>
        					</Modal.Body>
        					<Modal.Footer>
          						<Button onClick={this.toggleShow} variant="secondary" >
            						Close
          						</Button>
          					 	<Button onClick={() => console.log('click')} variant="primary" >
            						Submit
          						</Button>
	        				</Modal.Footer>
	        			</Form>
      				</Modal>
				</div>


			</div>

		);



	}


}

export default AMessages;