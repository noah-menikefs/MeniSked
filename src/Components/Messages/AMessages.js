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
			msg: '',
			dshow: false,
			messages: [],
			peopleList: [],
			entryList: [],
			callList: []
		}
	}

	componentDidMount = () => {
		this.loadMessages();
		this.loadUsers();
		this.loadEntries();
		this.loadCallTypes();
	}

	loadMessages = () => {
		fetch('http://localhost:3000/amessages')
			.then(response => response.json())
			.then(messages => this.setState({
				messages: messages
			}));
	}
	loadUsers = () => {
		fetch('http://localhost:3000/people')
			.then(response => response.json())
			.then(users => this.setState({peopleList: users}));
	}

	loadEntries = () => {
		fetch('http://localhost:3000/sked/entries')
			.then(response => response.json())
			.then(entries => this.setState({entryList: entries}));
	}

	loadCallTypes = () => {
		fetch('http://localhost:3000/callTypes')
			.then(response => response.json())
			.then(calls => this.setState({callList: calls}));
	}
	

	toggleShow = () => {
		this.setState({
			show: !this.state.show,
			msg: ''
		});
	}

	toggleDShow = (route) => {
	    this.setState({ 
			dshow: !this.state.dshow,
		    msg: route
	   	});
	 };

	onMsgChange = (event) => {
		console.log(event.target.value);
		this.setState({msg: event.target.value});
	}

	docIdToName = (id) => {
		id = parseInt(id,10);
		for (let i = 0; i < this.state.peopleList.length; i++){
			if (id === this.state.peopleList[i].id){
				return this.state.peopleList[i].firstname + ' ' + this.state.peopleList[i].lastname;
			}
		}
	}

	entryIdToName = (id) => {
		id = parseInt(id,10);
		const arr = [...this.state.entryList, ...this.state.callList]
		for (let i = 0; i < arr.length; i++){
			if (id === arr[i].id){
				return arr[i].name;
			}
		}
	}

	dateStyler = (dates) => {
		if (dates.length === 1){
			return 'on ' + dates[0]
		}
		//OTHER OPTIONS
		else {
			return 'from ' + dates[0] + ' - ' + dates[dates.length-1];
		}
	}

	render(){
		const {show, dshow, msg, messages} = this.state;

		let pendingList = [];
		let pastList = [];
		let pends = [];
		let past = [];
		for (let i = 0; i < messages.length; i++){
			if (messages[i].status === 'pending'){
				pends.push(messages[i]);
			}
			else{
				past.push(messages[i]);
			}
		}

		for (let n = 0; n < pends.length; n++){
			pendingList.push(
				<ListGroup horizontal>
					<ListGroup.Item className='pend list' action><p className="requestList">{this.docIdToName(pends[n].docid)} has requested {this.entryIdToName(pends[n].entryid)} {this.dateStyler(pends[n].dates)}</p>
					  	<Button className="accept" size="sm" variant="success">Accept</Button>
					  	<Button className="deny" size="sm" variant="danger" onClick={this.toggleShow}>Deny</Button>
					</ListGroup.Item>
					<ListGroup.Item className='dates list'>{pends[n].stamp}</ListGroup.Item>
				</ListGroup>
			)
		}


		
		

		return(
			<div>
				<h4 className="requests">Pending</h4>
				<div className="listStyleA">
					{pendingList}
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
						<ListGroup.Item className='pend list' action onClick={() => this.toggleDShow("Sorry, I can't let you work that day.")}>
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
						<ListGroup.Item className='pend list' action onClick={() => this.toggleDShow("Sorry, I can't let you go on vacation then.")}>
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
						<ListGroup.Item className='pend list' action onClick={() => this.toggleDShow("Sorry, I can't let you work that day.")}>
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
						<ListGroup.Item className='pend list' action onClick={() => this.toggleDShow("Sorry, I can't let you go on vacation then.")}>
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
				<div className='modal'>
					<Modal show={dshow} onHide={() => this.toggleDShow('')}>
						<Modal.Header closeButton>
							<Modal.Title id='modalTitle'>Denied Request Explanation</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>{msg}</p>
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={() => this.toggleDShow('')} variant="secondary" >
								Close
							</Button>
						</Modal.Footer>
					</Modal>
				</div>


			</div>

		);



	}


}

export default AMessages;