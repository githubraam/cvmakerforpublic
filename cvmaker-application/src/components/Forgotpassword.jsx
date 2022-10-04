import '../styles/scss/pages/signin.scss'
import PageHeader from '../snippets/PageHeader';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../styles/scss/transition.scss'
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Forgotpassword = () => {
    const [logwithPhone, setLogwithPhone] = useState(false);
    const [email, setEmail] = useState('');
    const [error,seterror] = useState({});
    const [otpSend, setOtpSend] = useState(false);
    const [otp, setOtp] = useState('');
    //const [response,setResponse] = useState({});
    const [otpMatchStatus, setotpMatchStatus] = useState('');
    const [newpassword, setNewpassword] = useState({})

    const toggleLoginOption = () =>{
        setLogwithPhone( !logwithPhone );
    }
    let navigate = useNavigate();
    function handleForgetSubmit(e){
        e.preventDefault();
        axios.post('/send-email', {
            email
          })
          .then(function (res) {
            console.log(res);           
            setOtpSend(true);
            localStorage.setItem('email',email) ;
          })
          .catch(function (error) {
            //console.log(error);
            seterror(error.error.data)
          });
    }



    function handleSubmitOtp(e){
        e.preventDefault();
        let email = localStorage.getItem('email');
        axios.post('/match-otp', {
            otp,
            email
          })
          .then(function (res) {
            console.log(res.data.otpMatched);
            setotpMatchStatus( JSON.parse(res.data.otpMatched) );
          })
          .catch(function (error) {
            //console.log(error);
            seterror(error.error.data)
          });
    }


    function handlePasseordChange(e){
        e.preventDefault();
        let email = localStorage.getItem('email');

        if( newpassword.password === newpassword.confirmPass ){
            seterror(error.msg = "Password are not same")
        }else{
            axios.post('/match-otp', {
                password: newpassword.password,
                email
              })
              .then(function (res) {
                seterror(error.msg = "")
                navigate("/login")
              })
              .catch(function (error) {
                //console.log(error);
                seterror(error.error.data)
              });
        }
        
    }

    return (
        <>
            <PageHeader>
                <div className='formWrapper login mx-auto py-5 mt-5 mb-5'>
                    <h1 className='fs-2 fw-semibold mb-4'>Forgot Password</h1>
                    <form>
                        
                        <div className='form-group mb-4'>
                        <label htmlFor="email" className='mb-2 boldMedium'>Email</label>
                        <input className='form-control' disabled={otpSend} type='email' id='email' placeholder="yormail@gmail.com" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                            {/* <label htmlFor="email" className='mb-2 boldMedium'>{logwithPhone ? 'Phone' : 'Email'} <span className='ms-3 alternateLogin' onClick={toggleLoginOption}>Reset with {logwithPhone ? 'Email Id' :'Phone Number'}?</span></label>
                            <CSSTransition classNames="slideIn" in={!logwithPhone} timeout={100} unmountOnExit >
                            <input className='form-control' disabled={otpSend} type='email' id='email' placeholder="yormail@gmail.com" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                            </CSSTransition>
                            <CSSTransition classNames="slideIn" in={logwithPhone} timeout={100} unmountOnExit >
                                <input className='form-control' type='text' id='email' placeholder="Phone Number" /> 
                            </CSSTransition> */}
                        </div>
                        <CSSTransition classNames="slideIn" in={otpSend} timeout={100} unmountOnExit >
                        <div className='form-group mb-4'>
                            <label htmlFor="otp" className='mb-2 boldMedium'>Enter Otp</label>
                            <input className='form-control' type='text' value={otp} onChange={(e)=>{setOtp(e.target.value)}}  id='otp' placeholder="- - - -" /> 
                        </div>
                        </CSSTransition>

                        <CSSTransition classNames="slideIn" in={otpMatchStatus} timeout={100} unmountOnExit >
                        <>
                        <div className='form-group mb-4'>
                            <label htmlFor="password" className='mb-2 boldMedium'>Password</label>
                            <input name='password' value={newpassword.password || ''} onChange={(e)=>{ setNewpassword({...newpassword, [e.target.name] : e.target.value}) }} className='form-control' type='password' id='password' placeholder="Password" />
                            
                        </div>

                        <div className='form-group'>
                            <label htmlFor="cpassword" className='mb-2 boldMedium'>Confirm Password</label>
                            <input name='confirmPass' value={newpassword.confirmPass || ''} onChange={(e)=>{ setNewpassword({...newpassword, [e.target.name] : e.target.value}) }}className='form-control' type='password' id='cpassword' placeholder="Password" />
                            
                        </div>
                        </>
                        </CSSTransition>

                        <div className='form-group text-center mt-4'>
                            
                            {!otpSend && <button className='rounded px-5 py-2 btn btn-primary' onClick={handleForgetSubmit}>Recover Now</button>}
                            {otpSend && <button className='rounded px-5 py-2 btn btn-primary' onClick={handleSubmitOtp}>Submit Otp</button>}
                            {otpMatchStatus && <button className='rounded px-5 py-2 btn btn-primary' onClick={handlePasseordChange}>Change Password</button>}

                            {error.msg && <Alert className='mt-4' onClose={() => seterror({})} dismissible variant='danger'>
                                <p className='mb-0'>{error.msg}</p>
                            </Alert>}
                        </div>
                        
                    </form>
                </div>
            </PageHeader>

        </>
    )
}

export default Forgotpassword;