import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
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
			callList: [],
			ctr: 10,
			id: -1
		}
	}

	componentDidMount = () => {
		this.loadMessages();
		this.loadUsers();
		this.loadEntries();
		this.loadCallTypes();
	}

	months = moment.months(); // List of each month

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
	
	respond = (id, status) => {
		fetch('http://localhost:3000/amessages', {
			method: 'put',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				id: id,
				status: status,
				msg: this.state.msg,
				stamp: this.props.today.format('MM/DD/YYYY')
			})
		})
			.then(response => response.json())
			.then(message => {
				if (message){
					this.loadMessages();
				}
			})
		if (status === 'accepted'){
			this.accept(id);
		}
		this.setState({
			msg: '',
			show: false
		})
	}

	accept = (id) => {

	}

	toggleShow = (id = -1) => {
		this.setState({
			show: !this.state.show,
			msg: '',
			id: id
		});
	}

	toggleDShow = (route) => {
	    this.setState({ 
			dshow: !this.state.dshow,
		    msg: route
	   	});
	 };

	onMsgChange = (event) => {
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
		let splitArr = [];
		let flag = false;

		if (dates.length === 1){
			splitArr = dates[0].split('/');
			return 'on ' + this.months[splitArr[0] - 1] + ' ' + splitArr[1] + ', ' + splitArr[2];
		}

		for (let i = 0; i < dates.length; i++){
			if (dates[i].charAt(4) === '/'){
				dates[i] = dates[i].substring(0,3) + '0' + dates[i].substring(3);
			}
		}

		dates.sort(function(a, b){return a.substring(3,5) - b.substring(3,5)})

		for (let i = 0; i < dates.length; i++){
			splitArr.push(dates[i].split('/'));
		}


		for (let n = 1; n < splitArr.length; n++){
			if (splitArr[n][0] !== splitArr[n-1][0] || (splitArr[n][1] - 1) !== parseInt(splitArr[n-1][1],10) || splitArr[n][2] !== splitArr[n-1][2]){
				flag = true;
				break;
			}
		}

		if (flag){
			let str = "on " + this.months[splitArr[0][0] - 1] + ' ' + splitArr[0][1] + ', ' + splitArr[0][2];
			for (let j = 1; j < splitArr.length; j++){
				str = str + ', ' + this.months[splitArr[j][0] - 1] + ' ' + splitArr[j][1] + ', ' + splitArr[j][2];
			}
			return str;
		}

		return 'from ' + this.months[splitArr[0][0] - 1] + ' ' + splitArr[0][1] + ', ' + splitArr[0][2] + ' - ' + this.months[splitArr[splitArr.length - 1][0] - 1] + ' ' + splitArr[splitArr.length - 1][1] + ', ' + splitArr[splitArr.length - 1][2]
	
	}

	showMore = () => {
		this.setState({ctr: this.state.ctr+10})
	}

	showButton = (length) => {
		if (this.state.ctr < length){
			return (<Button onClick={this.showMore} className='showMore' variant="primary">Show More</Button>);
		}
	}

	render(){
		const {show, dshow, msg, messages, ctr} = this.state;
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
				<ListGroup key={n} horizontal>
					<ListGroup.Item className='pend list' action><p className="requestList">{this.docIdToName(pends[n].docid)} has requested {this.entryIdToName(pends[n].entryid)} {this.dateStyler(pends[n].dates)}</p>
					  	<Button onClick={() => this.respond(pends[n].id,'accepted')} className="accept" size="sm" variant="success">Accept</Button>
					  	<Button onClick={() => this.toggleShow(pends[n].id)} className="deny" size="sm" variant="danger">Deny</Button>
					</ListGroup.Item>
					<ListGroup.Item className='dates list'>{pends[n].stamp}</ListGroup.Item>
				</ListGroup>
			)
		}

		for (let j = (Math.min(past.length,ctr)) - 1; j >= 0; j--){
			if (past[j].status === 'accepted'){
				pastList.push(
					<ListGroup key={j} horizontal>
						<ListGroup.Item className='past list' action disabled>
							You <span className='accepted'>accepted</span> {this.docIdToName(past[j].docid)}'s request for {this.entryIdToName(past[j].entryid)} {this.dateStyler(past[j].dates)}
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>{past[j].stamp}</ListGroup.Item>
					</ListGroup>
				);
			}
			else{
				pastList.push(
					<ListGroup key={j} horizontal>
						<ListGroup.Item className='past list' action onClick={() => this.toggleDShow(past[j].msg)}>
							You <span className='denied'>denied</span> {this.docIdToName(past[j].docid)}'s request for {this.entryIdToName(past[j].entryid)} {this.dateStyler(past[j].dates)}
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>{past[j].stamp}</ListGroup.Item>
					</ListGroup>
				);
			}
		}

		return(
			<div>
				<h4 className="requests">Pending</h4>
				<div className="listStyleA">
					{pendingList}
				</div>
				<h4 className="requests">Past Requests</h4>
				<div className='listStyleE'>
					{pastList}
				</div>
				<div>
					{this.showButton(past.length)}
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
          					 	<Button onClick={() => this.respond(this.state.id, "denied")} variant="primary" >
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