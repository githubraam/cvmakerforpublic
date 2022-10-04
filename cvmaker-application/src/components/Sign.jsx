import '../styles/scss/pages/signin.scss'
import PageHeader from '../snippets/PageHeader';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../styles/scss/transition.scss'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import { logIn, userInfo } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    //const [logwithPhone, setLogwithPhone] = useState(false);
    const [error, setError] = useState('')
    const [showError, setShowError] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        phone: ''
    })
    /* const toggleLoginOption = () =>{
        setLogwithPhone( !logwithPhone );
    }
 */

    const signInHandler = async (e) =>{
        e.preventDefault();
        axios.defaults.withCredentials = true;
        
        await axios({
            method: 'post',
        url: '/login',
        data: {
            email: loginData.email,
            password: loginData.password,
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' },
        }
        }).then((e)=>{
            //console.log(e.data)
            dispatch(logIn());
            dispatch( userInfo(e.data) )
            localStorage.setItem('isLoggedIn',true);
            navigate('/mycvs');
            
        }).catch((err)=>{
            console.log(err)
            if(err.response.data.error){
                setShowError(true)
                setError(err.response.data.error)
            }
        });
    }
    return (
        <>
            <PageHeader>
                <div className='formWrapper login mx-auto py-5 mt-5 mb-5'>
                    <h1 className='fs-2 fw-semibold mb-4'>Login to account</h1>
                    <form>
                        
                        <div className='form-group mb-4'>
                        <label htmlFor="email" className='mb-2 boldMedium'>Email</label>
                        <input className='form-control' value={loginData.email}  onChange={(e)=>{setLoginData({...loginData,email:e.target.value})}} required type='email' id='email' name='email' placeholder="yormail@gmail.com" />
                            {/* <label htmlFor="email" className='mb-2 boldMedium'>{logwithPhone ? 'Phone' : 'Email'} <span className='ms-3 alternateLogin' onClick={toggleLoginOption}>login with {logwithPhone ? 'Email Id' :'Phone Number'}?</span></label>
                            <CSSTransition classNames="slideIn" in={!logwithPhone} timeout={100} unmountOnExit >
                            <input className='form-control' value={loginData.email}  onChange={(e)=>{setLoginData({...loginData,email:e.target.value})}} type='email' id='email' name='email' placeholder="yormail@gmail.com" />
                            </CSSTransition>
                            <CSSTransition classNames="slideIn" in={logwithPhone} timeout={100} unmountOnExit >
                                <input className='form-control' type='text'  value={loginData.phone}  onChange={(e)=>{setLoginData({...loginData,phone:e.target.value})}} name='phone' placeholder="Phone Number" /> 
                            </CSSTransition> */}
                            
                            
                        </div>
                        
                        
                        <div className='form-group'>
                            <label htmlFor="password" className='mb-2 boldMedium'>Password</label>
                            <input className='form-control' value={loginData.password} onChange={(e)=>{setLoginData({...loginData,password:e.target.value})}} id="password" type="password" placeholder='Password' />
                        </div>

                        <div className='form-group text-center mt-4'>

                            {showError && <Alert onClose={() => setShowError(false)} variant="primary" dismissible>{error}</Alert>}
                            
                            <Link to="/forgot-password" className='d-block mb-3 boldMedium cursor-pointer forgotPassword' >Forgot Password</Link>
                                                        
                            <button className='rounded px-5 py-2 btn btn-primary' onClick={signInHandler}>Sign In</button>
                        </div>
                        
                    </form>
                </div>
            </PageHeader>
            
        </>
    )
}

export default Signin;