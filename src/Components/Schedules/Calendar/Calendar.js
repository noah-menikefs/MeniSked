import React from 'react';
import moment from 'moment';
import './Calendar.css';


moment().format();


class Calendar extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			style: props.style || {}
		}
	}

	


	weekdays = moment.weekdays(); //List of weekdays
	weekdaysShort = moment.weekdaysShort(); //List of shortened days
	months = moment.months(); // List of each month

	year = () => {
		return this.props.dateContext.format('Y');
	}
	month = () => {
		return this.props.dateContext.format('MMMM');
	}
	daysInMonth = () => {
		return this.props.dateContext.daysInMonth();
	}
	currentDate = () => {
		return this.props.dateContext.get('date');
	}
	currentDay = () => {
		return this.props.dateContext.format('D');
	}

	firstDayofMonth = () => {
		let dateContext = this.props.dateContext;
		let firstDay = moment(dateContext).startOf('month').format('d'); //Day of week 0-6
		return firstDay;
	}



	onDayClick = (e,day) => {
		this.props.onDayClick && this.props.onDayClick(e,day);
	}

	onDoubleClick = (e,day) => {
		this.props.onDoubleClick && this.props.onDoubleClick(e,day);
	}

	dayType = (d) => {
		if (this.props.type === "Personal"){
			return (
				<ul>
					{this.personalToday(d)}
				</ul>
			)
		}
		else if (this.props.type === "Call"){
			return (
				<ul>
					{this.callToday(d)}
				</ul>
				)
		}

		else{
			return (
				<ul>
					{this.workToday(d)}
				</ul>
			)
		}
	}

	holidayToday = (d) => {
		const arr = [...this.props.holiDays]
		for (let i = 0; i < arr.length; i++){
			if (arr[i].day === d){
				return <span id="holiday">{arr[i].name}</span>
			}
		}
	}

	callToday = (d) => {
		const arr = [...this.props.callSked];
		const list = [];
		for (let i = 0; i < arr.length; i++){
			const splitArr = arr[i].date.split('/');
			if (splitArr[0] === this.props.dateContext.format('MM') && splitArr[1] == d && splitArr[2] === this.props.dateContext.format('YYYY')){	
				list.push(<li className="call" id="call">{this.idToName(arr[i].id) + ' '}<span style={{'background-color':arr[i].colour}}>{arr[i].name}</span></li>);
			}
		}
		return list;
	}

	personalToday = (d) => {
		const arr = [...this.props.personalDays];
		for (let i = 0; i < arr.length; i++){
			const splitArr = arr[i].date.split('/');
			if (splitArr[0] === this.props.dateContext.format('MM') && splitArr[1] == d && splitArr[2] === this.props.dateContext.format('YYYY')){	
				return <li className="personal" id="personal">{this.idToName(arr[i].id)}</li>
			}
		}
	}

	workToday = (d) => {
		const arr = [...this.props.sked];
		const list = [];
		for (let i = 0; i < arr.length; i++){
			const splitArr = arr[i].date.split('/');
			if (splitArr[0] === this.props.dateContext.format('MM') && splitArr[1] == d && splitArr[2] === this.props.dateContext.format('YYYY')){	
				list.push(<li className="call" id="call">{this.idToName(arr[i].id) + ' '}<span style={{'background-color':arr[i].colour}}>{arr[i].name}</span></li>);
			}
		}
		return list;
	}

	idToName = (id) => {
		for (let n = 0; n < this.props.callList.length; n++){
				if (this.props.callList[n].id === id){
					return this.props.callList[n].name;
				}
			}
		for (let i = 0; i < this.props.entries.length; i++){
			if (this.props.entries[i].id === id){
				return this.props.entries[i].name;
			}
		}
	}

	render(){

		//Map the weekdays as <td>
		let weekdays = this.weekdaysShort.map((day) => {
			return (
				<td key={day} className="week-day">{day}</td>
			)
		});
		let blanks = [];
		for (let i = 0; i < this.firstDayofMonth(); i++){
			blanks.push(<td key={i*80} className="emptySlot">{" "}</td>);	
		}

		let daysInMonth = [];
		for (let d = 1; d <= this.daysInMonth(); d++){
			let className = (d === this.currentDay() ? "day current-day" : "day");
			daysInMonth.push(
				<td key={d} onClick={(e) => {this.onDayClick(e,d)}} className={className}>
					<div className="spacer">
						{this.holidayToday(d)}
						<span className="text" >{d}</span>
					</div>
					<hr/>
					{this.dayType(d)}
				</td>
			);
		}

		let len = blanks.length + daysInMonth.length;

		let extraBlanks = [];

		while ((len % 7)!== 0){
			len++;
			extraBlanks.push(<td key={len} className="emptySlot">{" "}</td>)
		}

		var totalSlots = [...blanks, ...daysInMonth, ...extraBlanks];
		let rows = [];
		let cells = [];

		totalSlots.forEach((row, i) => {
			if ((i % 7) !== 0 ) {
				cells.push(row);
			}
			else{
				let insertRow = cells.slice();
				rows.push(insertRow);
				cells = [];
				cells.push(row);
			}
			if (i === totalSlots.length -1 ){
				let insertRow = cells.slice();
				rows.push(insertRow);
			}
		});

		let trElements = rows.map((d, i) => {
			return (
				<tr key={i*100}>
					{d}
				</tr>
			);
		})



		return(
			<div className="calendar-container" style={this.state.style}>
				<table className="calendar">
					<thead>
						<tr className="calendar-header">
							<td colSpan="2" className="nav-month">
								<i className="prev fa fa-fw fa-chevron-left"
									onClick={(e) => {this.prevMonth()}}>
								</i>
								<i className="prev fa fa-fw fa-chevron-right"
									onClick={(e) => {this.nextMonth()}}>
								</i>
							</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							{weekdays}
						</tr>
						{trElements}
					</tbody>

				</table>
			</div>
		);



	}


}

export default Calendar;