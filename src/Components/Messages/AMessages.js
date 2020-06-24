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
		console.log(event.target.value);
		this.setState({msg: event.target.value});
	}

	render(){
		const {show} = this.state;
		return(
			<div>
				<h4 className="requests">Pending</h4>
				<div className="listStyleA">
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action><p className="requestList">Noah Menikefs has requested vacation from May 15, 2020 - May 20, 2020</p>
						  	<Button className="accept" size="sm" variant="success">Accept</Button>
						  	<Button className="deny" size="sm" variant="danger" onClick={this.toggleShow}>Deny</Button>
						</ListGroup.Item>
						<ListGroup.Item className='dates list'>06/24/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action><p className="requestList">Nikhil Ismail has requested 2nd call from June 1, 2020 - June 3, 2020</p>
						  	<Button className="accept" size="sm" variant="success">Accept</Button>
						  	<Button className="deny" size="sm" variant="danger" onClick={this.toggleShow}>Deny</Button>
						</ListGroup.Item>
						<ListGroup.Item className='dates list'>06/19/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action><p className="requestList">Paul Miskew has requested 1st call from May 28, 2020 - May 30, 2020</p>
						  	<Button className="accept" size="sm" variant="success">Accept</Button>
						  	<Button className="deny" size="sm" variant="danger" onClick={this.toggleShow}>Deny</Button>
						</ListGroup.Item>
						<ListGroup.Item className='dates list'>06/17/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action><p className="requestList">Noah Menikefs has requested vacation from December 15, 2020 - December 27, 2020</p>
						  	<Button className="accept" size="sm" variant="success">Accept</Button>
						  	<Button className="deny" size="sm" variant="danger" onClick={this.toggleShow}>Deny</Button>
						</ListGroup.Item>
						<ListGroup.Item className='dates list'>06/03/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action><p className="requestList">Jordan Weiss has requested vacation on December 25th, 2020</p>
						  	<Button className="accept" size="sm" variant="success">Accept</Button>
						  	<Button className="deny" size="sm" variant="danger" onClick={this.toggleShow}>Deny</Button>
						</ListGroup.Item>
						<ListGroup.Item className='dates list'>06/03/2020</ListGroup.Item>
					</ListGroup>
				</div>
				<h4 className="requests">Past Requests</h4>
				<div className='listStyleE'>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action disabled>You <span className='accepted'>accepted</span> John Smith's request for 1st call on July 17, 2020
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>06/24/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action disabled>
							You <span className='accepted'>accepted</span> Sally Jenkins request for vacation from July 2, 2020 - July 6, 2020
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>06/17/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action onClick={() => this.toggleShow("Sorry, I can't let you work that day.")}>
							You <span className='denied'>denied</span> Noah Menikefs's request for 2nd call on August 3, 2020
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>05/29/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action disabled>
							You <span className='accepted'>accepted</span> Donald Trump's request for 1st call on June 30, 2020
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>04/22/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action onClick={() => this.toggleShow("Sorry, I can't let you go on vacation then.")}>
							You <span className='denied'>denied</span> Justin Trudeau's request for vacation from September 3, 2020 - September 10, 2020
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>01/08/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action disabled>You <span className='accepted'>accepted</span> Bob Joe's request for 1st call on July 17, 2020
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>06/24/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action disabled>
							You <span className='accepted'>accepted</span> James Johnson's request for vacation from July 2, 2020 - July 6, 2020
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>06/17/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action onClick={() => this.toggleShow("Sorry, I can't let you work that day.")}>
							You <span className='denied'>denied</span> Random Person's request for 2nd call on August 3, 2020
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>05/29/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action disabled>
							You <span className='accepted'>accepted</span> Nikhil Ismail's request for 1st call on June 30, 2020
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>04/22/2020</ListGroup.Item>
					</ListGroup>
					<ListGroup horizontal>
						<ListGroup.Item className='pend list' action onClick={() => this.toggleShow("Sorry, I can't let you go on vacation then.")}>
							You <span className='denied'>denied</span> Hudson Leon's request for vacation from September 3, 2020 - September 10, 2020
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>01/08/2020</ListGroup.Item>
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