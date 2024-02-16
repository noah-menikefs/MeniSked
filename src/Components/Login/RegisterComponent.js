import { React, useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Logo from '../../logo512.png';

const RegisterComponent = (validateEmail, loadUser, onRouteChange) => {
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [code, setCode] = useState('');
  const [errorShow, setErrorShow] = useState(false);
  const [msg, setMsg] = useState('');
  const [depts, setDepts] = useState([]);

  useEffect(() => {
    loadDepts();
  }, []);

  const loadDepts = () => {
    fetch('https://secure-earth-82827.herokuapp.com/departments')
      .then(response => response.json())
      .then(departments => setDepts(departments));
  }

  const onSubmitRegister = () => {
    if (password !== cPassword){
      toggleErrorShow('dp');
      return false;
    }
    let flag1 = false;
    let rCode = code.replace(' Admin','');
    for (let i = 0; i < depts.length; i++){
      if (rCode === depts[i].code){
        flag1 = true;
      }
    }
    if (!flag1){
      toggleErrorShow('code');
      return false;
    }
    else if (
      firstname.length > 0 && 
			lastname.length > 0 &&
			validateEmail(email) &&
			password.length > 0 &&
			code.length > 0
    ){

      let isadmin = false;
      if (code.includes("Admin")){
        isadmin = true;
      }
			
      fetch('https://secure-earth-82827.herokuapp.com/register', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: email,
          password: password,
          firstname: firstname,
          lastname: lastname,
          department: code,
          isadmin: isadmin,
        })
      })
        .then(response => response.json())
        .then(user => {
          if (user.lastname){
            loadUser(user)
            onRouteChange("Personal Schedule");
          }
          else if (user === 'user with this email already exists.'){
            this.toggleErrorShow('email');
          }
        })
    }
  }

  const toggleErrorShow = (type) => {
    if (type === 'dp'){
      setMsg('The passwords you entered do not match.')
    }
    else if (type === 'code'){
      setMsg("The department code you entered does not match our records. Please contact your department's administrator to confirm the appropriate code.")
    }
    else if (type === 'email'){
      setMsg('A user with this email address already exists. Please use the login page to sign in.')
    }
    setErrorShow(!errorShow)
  }

  return(
    <div>
      <div className='test shadow-2'>
        <div className='mt-3 spacing'id='loginHeader'>
          <img style={{paddingTop:'5px', height:90, width:90}} alt='Logo' src={Logo}/> 
          <h1 id='title'>MeniSked</h1>
        </div>
        <div className='justify-content-center'id='loginBody'>
          <Form onSubmit={onSubmitRegister}>
            <Form.Group controlId="formBasicFName">
              <Form.Control required onChange={(e) => setFirstname(e)} value={firstname} type="text" autoComplete="off" placeholder="First Name" />
            </Form.Group>
            <Form.Group controlId="formBasicLName">
              <Form.Control required onChange={(e) => setLastname(e)} value={lastname} type="text" autoComplete="off" placeholder="Last Name" />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Control required onChange={(e) => setEmail(e)} value={email} type="email" autoComplete="off" placeholder="Email" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Control required onChange={(e) => setPassword(e)} value={password} type="password" autoComplete="off" placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="formBasicCPassword">
              <Form.Control required onChange={(e) => setCPassword(e)} value={cPassword} type="password" autoComplete="off" placeholder="Confirm Password" />
            </Form.Group>
            <Form.Group controlId="formBasicCode">
              <Form.Control required onChange={(e) => setCode(e)} value={code} type="text" autoComplete="off" placeholder="Department Code" />
            </Form.Group>
            <Button onClick={onSubmitRegister} id='loginButton' variant="primary" >
                        Register
            </Button> 
          </Form>
        </div>
        <div className='modal'>
          <Modal show={errorShow} onHide={toggleErrorShow}>
            <Modal.Header closeButton>
              <Modal.Title id='modalTitle'>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {msg}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={toggleErrorShow}>
                            Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div className='shad spacing' id='loginFooter'>
          <p>Already a user? <span onClick={() => onRouteChange("Login", false)} className='label'>Login</span></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterComponent;