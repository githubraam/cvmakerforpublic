import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Link, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import {logOut} from "../store/authSlice"
import axios from 'axios';

const Mainmenu = () => {
    const dispatch  = useDispatch();
    const loginStatus = useSelector((state)=>state.auth.isLoggedIn);
    const navigate = useNavigate()

    function handleLogout(e){
        e.preventDefault();

             

        axios({
            method: 'post',
            url: '/logout',
            data:{
                withCredentials: true,
                headers: { crossDomain: true, 'Content-Type': 'application/json' },
            }
           
        }).then((e)=>{
            dispatch(logOut());
            navigate("/signin")
        }).catch((err)=>{
            console.log(err)
        });
    }
    return(
        <Navbar expand="lg">
                    <Container>
                        <Navbar.Brand as={Link} to="/">
                            <img className='img-fluid' src={'/assets/images/logo.png'} alt="cvmaker logo" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                {!loginStatus && <><Nav.Link  as={Link} to="/signin" ><img src={'/assets/images/usericon.png'} alt="" /> <span className='ms-2'>Sign In</span></Nav.Link>
                                <Nav.Link as={Link} to="/register" className='register rounded px-4 py-2 btn btn-primary  ms-3'>Register <img alt='' src="/assets/images/right-arrow.png" className='img-fluid ms-2' /></Nav.Link></>}

                                {loginStatus && <Dropdown>
                                    <Dropdown.Toggle className="rounded px-4 py-2 profileDropDown"><img src="/assets/images/man.png" alt='' className='icon img-fluid' /> Profile</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/mycvs">CV List</Dropdown.Item>
                                        <Dropdown.Item href="#" onClick={handleLogout}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>}
                            </Nav> 
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
    )
}

export default Mainmenu;