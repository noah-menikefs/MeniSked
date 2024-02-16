import { validateEmail } from '../../Utils/email';

const RegisterComponent = ({loadUser, onRouteChange}) => {
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState({show: false, message: ''});
    const [depts, setDepts] = useState([]);

  useEffect(() => {
    loadDepts();
  }, []);

    const loadDepts = () => {
        fetch('https://secure-earth-82827.herokuapp.com/departments')
            .then(response => response.json())
            .then(departments => setDepts(departments))
            .catch(error => console.error('Error loading departments:', error));
    }
    setErrorShow(!errorShow);
  };

    const onSubmitRegister = (event) => {
        event.preventDefault();

        if (password !== cPassword){
			showError('Passwords do not match');
			return;
		}

        let rCode = code.replace(' Admin','');
        const deptExists = depts.some(dept => dept.code === rCode);
        if (!departmentExists) {
            showError('Department code does not match.');
            return;
        }

        if (!validateForm()) {
            return;
        }

        const isadmin = code.includes("Admin");
			
        fetch('https://secure-earth-82827.herokuapp.com/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email,
                password,
                firstname,
                lastname,
                department: code,
                isadmin,
            })
        })
            .then(response => response.json())
            .then(user => {
                if (user.lastname){
                    loadUser(user)
                    onRouteChange("Personal Schedule");
                }
                else if (user === 'user with this email already exists.'){
                    showError('Email address already exists.');
                }
            })
            .catch(error => console.error('Error registering user:', error));
    }

    const validateForm = () => {
        if (!firstname || !lastname || !validateEmail(email) || !password || !code) {
            showError('Please fill in all fields correctly.');
            return false;
        }
        return true;
    }

    const showError = (message) => {
        setError({ show: true, message });
    }

    const handleCloseError = () => {
        setError({ show: false, message: '' });
    }

    return(
        <div>
            <div className='test shadow-2'>
                <div className='mt-3 spacing' id='loginHeader'>
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
                    <Modal show={error.show} onHide={handleCloseError}>
                        <Modal.Header closeButton>
                            <Modal.Title id='modalTitle'>Error</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {error.message}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseError}>
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
