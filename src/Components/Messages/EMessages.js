import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import './Messages.css';

class EMessages extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			show: false,
			msg: '',
			messages: [],
			entryList: [],
			callList: [],
			ctr: 10
		}
	}

	componentDidMount = () => {
		this.loadMessages();
		this.loadEntries();
		this.loadCallTypes();
	}

	loadMessages = () => {
		fetch('http://localhost:3000/emessages/'+this.props.user.id)
      		.then(response => response.json())
      		.then(messages => this.setState({messages: messages.filter((message => message.status !== 'pending'))}));
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

	months = moment.months(); // List of each month

	toggleShow = (route) => {
	    this.setState({ 
			show: !this.state.show,
		    msg: route
	   	});
	 };

	showMore = () => {
		this.setState({ctr: this.state.ctr+10})
	}

	showButton = (length) => {
		if (this.state.ctr < length){
			return (<Button onClick={this.showMore} className='showMore' variant="primary">Show More</Button>);
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

	render(){
		const {show, msg, messages, ctr} = this.state;

		let msgList = [];

		for (let j = (Math.min(messages.length,ctr)) - 1; j >= 0; j--){
			if (messages[j].status === 'accepted'){
				msgList.push(
					<ListGroup key={j} horizontal>
						<ListGroup.Item className='pend list' action disabled>Peter Menikefs <span className={messages[j].status}>{messages[j].status}</span> your request for {this.entryIdToName(messages[j].entryid)} {this.dateStyler(messages[j].dates)}
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>{messages[j].stamp}</ListGroup.Item>
					</ListGroup>
				)
			}
			else{
				msgList.push(
					<ListGroup key={j} horizontal>
						<ListGroup.Item className='pend list' action onClick={() => this.toggleShow(messages[j].msg)}>Peter Menikefs <span className={messages[j].status}>{messages[j].status}</span> your request for {this.entryIdToName(messages[j].entryid)} {this.dateStyler(messages[j].dates)}
						</ListGroup.Item>
						<ListGroup.Item className='edates list'>{messages[j].stamp}</ListGroup.Item>
					</ListGroup>
				)
			}
			
		}

		return(
			<div>
				<div className='listStyleE'>
					{msgList}
				</div>
				<div>
					{this.showButton(messages.length)}
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