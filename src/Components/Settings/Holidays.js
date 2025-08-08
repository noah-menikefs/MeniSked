import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Scroll from "./../Scroll/Scroll";
import moment from "moment";
import "./Settings.css";

const Holidays = (props) => {
  const [rHolidayList, setRHolidayList] = useState([]);
  const [nrHolidayList, setNRHolidayList] = useState([]);
  const [newNRshow, setNewNRshow] = useState(false);
  const [newRshow, setNewRshow] = useState(false);
  const [sShow, setSShow] = useState(false);
  const [eShow, setEShow] = useState(false);
  const [add, setAdd] = useState(false);
  const [name, setName] = useState("");
  const [month, setMonth] = useState("January");
  const [day, setDay] = useState(1);
  const [isactive, setIsactive] = useState(false);
  const [dateContext, setDateContext] = useState(moment());
  const [todelete, setTodelete] = useState([]);
  const [editsked, setEditsked] = useState(false);

  const months = moment.months();

  useEffect(() => {
    loadrHolidays();
    loadnrHolidays();
  }, []);

  const loadrHolidays = () => {
    fetch("https://secure-earth-82827.herokuapp.com/holiday/r")
      .then((response) => response.json())
      .then((holidays) => setRHolidayList(holidays));
  };

  const loadnrHolidays = () => {
    fetch("https://secure-earth-82827.herokuapp.com/holiday/nr")
      .then((response) => response.json())
      .then((holidays) => setNRHolidayList(holidays));
  };

  const addOrEdit = () => {
    if (add === true) {
      onNewRHoliday();
    } else {
      onEditRHoliday();
    }
  };

  const onNewRHoliday = () => {
    if (name.length > 0) {
      fetch("https://secure-earth-82827.herokuapp.com/holiday/r", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          isactive: isactive,
          month: month,
          day: parseInt(day, 10),
        }),
      })
        .then((response) => response.json())
        .then((holiday) => {
          if (holiday) {
            loadrHolidays();
          }
        });
      toggleRShow();
    }
  };

  const onNewNRHoliday = () => {
    if (name.length > 0) {
      fetch("https://secure-earth-82827.herokuapp.com/holiday/nr", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
        }),
      })
        .then((response) => response.json())
        .then((holiday) => {
          if (holiday) {
            loadnrHolidays();
          }
        });
      toggleNRShow();
    }
  };

  const onEditRHoliday = () => {
    fetch("https://secure-earth-82827.herokuapp.com/holiday/r", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        isactive: isactive,
        month: month,
        day: parseInt(day, 10),
      }),
    })
      .then((response) => response.json())
      .then((holiday) => {
        if (holiday) {
          loadrHolidays();
        }
      });
    toggleRShow();
  };

  const onDeleteRHoliday = (e) => {
    fetch("https://secure-earth-82827.herokuapp.com/holiday/r", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: e.target.parentNode.id,
      }),
    })
      .then((response) => response.json())
      .then((holiday) => {
        if (holiday) {
          loadrHolidays();
        }
      });
  };

  const onDeleteNRHoliday = (e) => {
    fetch("https://secure-earth-82827.herokuapp.com/holiday/nr", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: e.target.parentNode.id,
      }),
    })
      .then((response) => response.json())
      .then((holiday) => {
        if (holiday) {
          loadnrHolidays();
        }
      });
  };

  const onSkedHoliday = (e) => {
    fetch("https://secure-earth-82827.herokuapp.com/holiday/snr", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        year: dateContext.format("Y"),
        month: dateContext.format("MM"),
        day: parseInt(day, 10),
      }),
    })
      .then((response) => response.json())
      .then((holiday) => {
        if (holiday) {
          loadnrHolidays();
        }
      });
    toggleSShow();
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMonthChange = (event, r = true) => {
    setMonth(event.target.value);
    if (!r) {
      setMonthState(event.target.value);
    }
  };

  const setMonthState = (month) => {
    let monthNo = months.indexOf(month);
    let newDateContext = moment(dateContext).set("month", monthNo);
    setDateContext(newDateContext);
  };

  const onDayChange = (event) => {
    setDay(event.target.value);
  };

  const onYearChange = (event, r = true) => {
    setYear(event.target.value);
  };

  const onActiveChange = () => {
    setIsactive(!isactive);
  };

  const setYear = (year) => {
    let newDateContext = moment(dateContext).set("year", year);
    setDateContext(newDateContext);
  };

  const toggleNRShow = () => {
    setNewNRshow(!newNRshow);
  };

  const toggleRShow = (e) => {
    if (e && e.target.parentNode.id) {
      if (e.target.className.includes("add")) {
        setAdd(true);
      } else {
        setAdd(false);
        for (let i = 0; i < rHolidayList.length; i++) {
          if (rHolidayList[i].name === e.target.parentNode.id) {
            setName(rHolidayList[i].name);
            setMonth(rHolidayList[i].month);
            setDay(rHolidayList[i].day);
            setIsactive(rHolidayList[i].isactive);
          }
        }
      }
    } else {
      setName("");
      setMonth("January");
      setDay(1);
      setIsactive(false);
    }
    setNewRshow(!newRshow);
  };

  const toggleEShow = (e) => {
    if (e && e.target.parentNode.id) {
      setName(e.target.parentNode.id);
      setEditsked(true);
    } else {
      setName("");
      setTodelete([]);
      setEditsked(false);
    }
    setEShow(!eShow);
  };

  const toggleSShow = (e) => {
    if (e && e.target.parentNode.id) {
      setName(e.target.parentNode.id);
    } else {
      setName("");
      setMonth("January");
      setDay(1);
      setDateContext(props.today);
    }
    setSShow(!sShow);
  };

  const addModal = () => {
    if (add === true) {
      return (
        <Form.Control
          onChange={onNameChange}
          required
          type="text"
          placeholder="Name"
        />
      );
    }
    return <h5>{name}</h5>;
  };

  const skedList = () => {
    if (editsked) {
      let holiday;
      for (let i = 0; i < nrHolidayList.length; i++) {
        if (nrHolidayList[i].name === name) {
          holiday = nrHolidayList[i];
        }
      }
      let checkSelect = [];
      let arr = [...holiday.eventsked];
      for (let j = 0; j < arr.length; j++) {
        checkSelect.push(
          <Form.Check
            key={j}
            id={j}
            name="skeddates"
            onChange={addtodelete}
            type="checkbox"
            value={arr[j]}
            label={arr[j]}
          />
        );
      }
      return checkSelect;
    }
  };

  const addtodelete = (e) => {
    let arr = [...todelete];
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === e.target.value) {
        index = i;
      }
    }
    if (index !== -1) {
      arr.splice(index, 1);
    } else {
      arr.push(e.target.value);
    }
    setTodelete(arr);
  };

  const deleteSked = () => {
    let eventschedule = [];
    let id = -1;
    for (let i = 0; i < nrHolidayList.length; i++) {
      if (nrHolidayList[i].name === name) {
        id = nrHolidayList[i].id;
        eventschedule = [...nrHolidayList[i].eventsked];
      }
    }
    let indexes = [];
    for (let j = 0; j < todelete.length; j++) {
      for (let i = 0; i < eventschedule.length; i++) {
        if (eventschedule[i] === todelete[j]) {
          indexes.push(i);
        }
      }
    }
    indexes.sort(function (a, b) {
      return a - b;
    });
    for (let i = indexes.length - 1; i >= 0; i--) {
      eventschedule.splice(indexes[i], 1);
    }
    fetch("https://secure-earth-82827.herokuapp.com/holiday/esnr", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        arr: eventschedule,
      }),
    })
      .then((response) => response.json())
      .then((holiday) => {
        if (holiday) {
          loadnrHolidays();
        }
      });
    toggleEShow();
  };

  const { today } = props;

  let daySelect = [];
  for (let i = 1; i <= dateContext.daysInMonth(); i++) {
    daySelect.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  let yearSelect = [];

  let fYear = today.year();

  for (let i = fYear; i <= fYear + 10; i++) {
    yearSelect.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  let rList = [];
  for (let j = 0; j < rHolidayList.length; j++) {
    rList.push(
      <li key={rHolidayList[j].name} id={rHolidayList[j].name}>
        {rHolidayList[j].name}
        <Button
          key={j}
          onClick={toggleRShow}
          className="edit butn"
          size="sm"
          variant="secondary"
        >
          Edit
        </Button>
        <Button
          key={-j - 1}
          onClick={onDeleteRHoliday}
          className="delete butn"
          size="sm"
          variant="danger"
        >
          Delete
        </Button>
      </li>
    );
  }
  let nrList = [];
  for (let n = 0; n < nrHolidayList.length; n++) {
    nrList.push(
      <li key={nrHolidayList[n].name} id={nrHolidayList[n].name}>
        {nrHolidayList[n].name}
        <Button
          key={n * 100 + 1}
          onClick={toggleEShow}
          className="edit butn"
          size="sm"
          variant="secondary"
        >
          Edit
        </Button>
        <Button
          key={n}
          onClick={toggleSShow}
          className="sked butn"
          size="sm"
          variant="warning"
        >
          Schedule
        </Button>
        <Button
          key={-n - 1}
          onClick={onDeleteNRHoliday}
          className="delete butn"
          size="sm"
          variant="danger"
        >
          Delete
        </Button>
      </li>
    );
  }

  return (
    <div className="body">
      <div className="left">
        <div id="t" className="top">
          <h4 className="subtitle">Recurring Holidays</h4>
          <Button className="add" onClick={toggleRShow} variant="primary">
            Add Recurring Holiday
          </Button>
        </div>
        <Scroll>
          <ul className="setList">{rList}</ul>
        </Scroll>
      </div>
      <div className="right">
        <div className="top">
          <h4 className="subtitle">Non-recurring Holidays</h4>
          <Button onClick={toggleNRShow} variant="primary">
            Add Non-recurring Holiday
          </Button>
        </div>
        <Scroll>
          <ul className="setList">{nrList}</ul>
        </Scroll>
      </div>
      <div className="modal">
        <Modal show={newNRshow} onHide={toggleNRShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Add Non-recurring Holiday</Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Group>
                <Form.Control
                  onChange={onNameChange}
                  required
                  type="text"
                  placeholder="Name"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={toggleNRShow} variant="secondary">
                Cancel
              </Button>
              <Button onClick={onNewNRHoliday} variant="primary">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
      <div className="modal">
        <Modal show={newRshow} onHide={toggleRShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">
              Add/Edit Recurring Holiday
            </Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Group>{addModal()}</Form.Group>
              <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Control
                  value={month}
                  onChange={onMonthChange}
                  as="select"
                >
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Day of the Month</Form.Label>
                <Form.Control value={day} onChange={onDayChange} as="select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                  <option value="23">23</option>
                  <option value="24">24</option>
                  <option value="25">25</option>
                  <option value="26">26</option>
                  <option value="27">27</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                  <option value="30">30</option>
                  <option value="31">31</option>
                </Form.Control>
              </Form.Group>
              <Form.Group
                /*onChange={onActiveChange}*/ id="activeCheck"
                controlId="formBasicCheckbox"
              >
                <Form.Check
                  onChange={onActiveChange}
                  checked={isactive}
                  type="checkbox"
                  label="Active"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={toggleRShow} variant="secondary">
                Cancel
              </Button>
              <Button onClick={addOrEdit} variant="primary">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
      <div className="modal">
        <Modal show={sShow} onHide={toggleSShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Schedule Holiday</Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Group>
                <h3>{name}</h3>
              </Form.Group>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Control
                  value={dateContext.format("Y")}
                  onChange={onYearChange}
                  as="select"
                >
                  {yearSelect}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Control
                  onChange={(e) => onMonthChange(e, false)}
                  as="select"
                >
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Day of the Month</Form.Label>
                <Form.Control onChange={onDayChange} as="select">
                  {daySelect}
                </Form.Control>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={toggleSShow} variant="secondary">
                Cancel
              </Button>
              <Button onClick={onSkedHoliday} variant="primary">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
      <div className="modal">
        <Modal show={eShow} onHide={toggleEShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Edit {name} Schedule</Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Label>Choose dates to delete</Form.Label>
              <Form.Group
                /*onChange={onActiveChange} id="activeCheck"*/ controlId="formBasicCheckbox"
              >
                {skedList()}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={toggleEShow} variant="secondary">
                Close
              </Button>
              <Button onClick={deleteSked} variant="primary">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Holidays;
