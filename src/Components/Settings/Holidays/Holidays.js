import React from 'react';
import Button from 'react-bootstrap/Button';
import Scroll from '../../Scroll/Scroll'
import './Holidays.css';

class Holidays extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			rHolidayList: [

			],
			nrHolidayList: [



			]
		}
	}

	render(){
		return(
			<div className="body">
				<div className="left">
					
					<div className="top">
						<h4 className="subtitle">Recurring Holidays</h4>
						<Button variant="primary">Add Recurring Holiday</Button>
					</div>
					<Scroll>
						<ul className="">
							<li>
								New Year's Day 
								<input className='inp' onInput={() => console.log("click")} type="checkbox" id="l1" name="NYD" value="NYD"/>
								<Button onClick={() => console.log("click")} className="edit butn" size="sm" variant="secondary">Edit</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li>
								MLK Day 
								<input className='inp' onInput={() => console.log("click")} type="checkbox" id="l2" name="MLK" value="MLK"/>
								<Button onClick={() => console.log("click")} className="edit butn" size="sm" variant="secondary">Edit</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li>
								Christmas Day 
								<input className='inp' onInput={() => console.log("click")} type="checkbox" id="l3" name="christmas" value="christmas"/>
								<Button onClick={() => console.log("click")} className="edit butn" size="sm" variant="secondary">Edit</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>

						</ul>
					</Scroll>











				</div>
				<div className="right">
					<div className="top">
						<h4 className="subtitle">Non-recurring Holidays</h4>
						<Button variant="primary">Add Non-recurring Holiday</Button>
					</div>
					<Scroll>
						<ul className="">
							<li>
								Party
								<Button onClick={() => console.log("click")} className="sked butn" size="sm" variant="secondary">Schedule</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li>
								Easter
								<Button onClick={() => console.log("click")} className="sked butn" size="sm" variant="secondary">Schedule</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>
							<li>
								Cycle 4 St. Joes
								<Button onClick={() => console.log("click")} className="sked butn" size="sm" variant="secondary">Schedule</Button>
								<Button onClick={() => console.log("click")} className="delete butn" size="sm" variant="danger">Delete</Button>
							</li>


						</ul>
					</Scroll>









				</div>
			</div>


		);



	}


}

export default Holidays;