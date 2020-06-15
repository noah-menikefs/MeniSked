import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'
import './Messages.css';


class AMessages extends React.Component{
	constructor(){
		super();
		this.denyClick = this.denyClick.bind(this);
		this.state = {
			reqstatus: ''
		}
	}

	denyClick() {
	     alert("provide reason");
	}

	render(){
		return(
			<div>
				<h4>Requests</h4>

				<div className="size">

					<ListGroup horizontal>
					  <ListGroup.Item><p>Noah Menikefs has requested vacation from May 15, 2020 --> May 20, 2020  </p>
					  	<Button variant="success">Accept</Button>
					  	<Button variant="danger" onClick={this.denyClick}>Deny</Button>
					  </ListGroup.Item>
					  <ListGroup.Item>1 day ago</ListGroup.Item>
					</ListGroup>

					<ListGroup horizontal>
					  <ListGroup.Item><p>Nikhil Ismail has requested 2nd call from June 1, 2020 - June 3, 2020  </p>
					  	<Button variant="success">Accept</Button>
					  	<Button variant="danger">Deny</Button>
					  </ListGroup.Item>
					  <ListGroup.Item>5 days ago</ListGroup.Item>
					</ListGroup>

					<ListGroup horizontal>
					  <ListGroup.Item><p>Paul Miskew has requested 1st call from May 28, 2020 - May 30, 2020  </p>
					  	<Button variant="success">Accept</Button>
					  	<Button variant="danger">Deny</Button>
					  </ListGroup.Item>
					  <ListGroup.Item>1 week ago</ListGroup.Item>
					</ListGroup>

					<ListGroup horizontal>
					  <ListGroup.Item><p>Noah Menikefs has requested vacation from December 22, 2020 --> December 30, 2020  </p>
					  	<Button variant="success">Accept</Button>
					  	<Button variant="danger">Deny</Button>
					  </ListGroup.Item>
					  <ListGroup.Item>2 weeks ago</ListGroup.Item>
					</ListGroup>

				</div>


			</div>

		);



	}


}

export default AMessages;