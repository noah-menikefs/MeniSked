import React from 'react';
import Button from 'react-bootstrap/Button';
import Scroll from './../Scroll/Scroll'
import Form from 'react-bootstrap/Form'
import './Settings.css';

class CallTypes extends React.Component{
	constructor(){
		super();
		this.state = {
			callList: [


			],
			callName: '',
			priority: 1,
			isActive: false,
			add: true,
			id: -1
		}
	}

	componentDidMount = () => {
		this.loadCallTypes();
	}

	loadCallTypes = () => {
		fetch('http://localhost:3000/callTypes')
			.then(response => response.json())
			.then(calls => this.setState({callList: calls.sort(function(a, b){return a.priority - b.priority})}));
	}

	sortList = () => {
		let newArr = this.state.callList.sort(function(a, b){return a.priority - b.priority})
		this.setState({callList: newArr});
		console.log(this.state.callList);
	}

	addOrEdit = () => {
		if (this.state.add){
			this.addCall();
		}
		else{
			this.editCall();
		}
	}

	addCall = () => {
		fetch('http://localhost:3000/callTypes', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: this.state.callName,
				active: this.state.isActive,
				priority: parseInt(this.state.priority, 10)

			})
		})
			.then(response => response.json())
			.then(call => {
				if (call){
					this.loadCallTypes();
				}
			})
		this.setState({
			callName: '',
			priority: 1,
			isActive: false
		})
	}

	deleteCall = (e) => {
		fetch('http://localhost:3000/callTypes', {
			method: 'delete',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				id: parseInt(e.target.parentNode.id,10)
			})
		})
			.then(response => response.json())
			.then(calls => {
				if (calls){
					this.loadCallTypes();
				}
			})
	}
	
	editCall = () => {
		fetch('http://localhost:3000/callTypes', {
			method: 'put',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				name: this.state.callName,
				active: this.state.isActive,
				priority: parseInt(this.state.priority, 10),
				id: parseInt(this.state.id,10)
			})
		})
			.then(response => response.json())
			.then(call => {
				if (call){
					this.loadCallTypes();
				}
			})
		this.setState({
			callName: '',
			priority: 1,
			isActive: false,
			add: true,
			id: -1
		})
	}

	onPriorityChange = (e) => {
		this.setState({priority: e.target.value});
	}

	onNameChange = (e) => {
		this.setState({callName: e.target.value});
	}

	onActiveChange = () => {
		this.setState({isActive: !this.state.isActive});
	}

	onEdit = (e) => {
		const id = parseInt(e.target.parentNode.id,10)
		for (let i = 0; i < this.state.callList.length; i++){
			if (this.state.callList[i].id === id){
				this.setState({
					callName: this.state.callList[i].name,
					priority: this.state.callList[i].priority,
					isActive: this.state.callList[i].active,
					add: false,
					id: id
				})
				break;
			}
		}
	}

	onCancel = () => {
		this.setState({
			callName: '',
			priority: 1,
			isActive: false,
			add: true,
			id: -1
		})
	}

	render(){
		const {callList, callName, priority, isActive} = this.state;

		let priorityList = [];
		for (let j = 0; j < callList.length; j++){
			priorityList.push(
				<li key={callList[j].name} id={callList[j].id}>
					{callList[j].name}
					<Button key={j} onClick={this.onEdit} className="edit butn" size="sm" variant="secondary">Edit</Button>
					<Button key={-j-1} onClick={this.deleteCall} className="delete butn" size="sm" variant="danger">Delete</Button>
				</li>
			)
		}

		let prioritySelect = [];
		for (let n = 1; n <= callList.length+1; n++){
			prioritySelect.push(<option value={n} key={n}>{n}</option>);
		}

		return(
			<div className="body">
				<div className="left">
					
					<div className="top">
						<h4 className="subtitle">Priority List</h4>
					</div>
					<Scroll>
						<ol className="">
							{priorityList}
						</ol>
					</Scroll>

				</div>
				<div className="ct right">
					<div className="top">
						<h4 className="subtitle">Add/Edit Calls</h4>
					</div>
					<Form id="callForm" onSubmit={this.addOrEdit}>
						<div id="box" style={{border:'2px solid black', height: '200px'}}>
							<Form.Group id="name">
								<Form.Control required value={callName} onChange={this.onNameChange} type="text" placeholder="Name" />
							</Form.Group>
							<Form.Group id="priority" controlId="exampleForm.ControlSelect1">
    							<Form.Label>Priority</Form.Label>
   								<Form.Control onChange={this.onPriorityChange} value={priority} as="select">
	   								{prioritySelect}
   				 				</Form.Control>
  							</Form.Group> 
						  <Form.Group  id="activeCheck" controlId="formBasicCheckbox">
						    	<Form.Check onChange={this.onActiveChange} checked={isActive} type="checkbox" label="Active"/>
						 	 </Form.Group>
						</div>
						<div className="bottom">
							<Button onClick={this.onCancel} id='callSub' variant="secondary" type="cancel">
								Cancel
							</Button>
							<Button id='callSub' variant="primary" type="submit">
								Submit
							</Button>
						</div>
					</Form>
					


				</div>
			</div>



		);



	}


}

export default CallTypes;