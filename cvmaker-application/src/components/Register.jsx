import '../styles/scss/pages/signin.scss'
import PageHeader from '../snippets/PageHeader';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../styles/scss/transition.scss'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';


const Register = () => {

    const [registerFormData, setRegisterFormData] = useState({
        
    })

    const [error, setError] = useState({
        show: false,
        msg: ''
    })
    let navigate = useNavigate();


    const registerHandler = async (e) =>{
        e.preventDefault();
        axios.defaults.withCredentials = true;

        if( registerFormData.confirmPass!== registerFormData.password ){

            setError({msg:'Password do not match', show:true})
        }else{

            await axios.post('/register', {
                email: registerFormData.email,
                password: registerFormData.password,
                phoneNumber: registerFormData.phoneNumber,
                withCredentials: true,
                headers: { crossDomain: true, 'Content-Type': 'application/json' },
              })
              .then(function (response) {
                console.log(response);
                navigate('/signin')
                
              })
              .catch(function (error) {
                console.log(error);
                if((error.response.data)){
                    setError({msg:error.response.data, show:true})
                }
                
              });

            
        }
    }



    function handleInput(evt){
        const value = evt.target.value;
        setRegisterFormData({
            ...registerFormData,
            [evt.target.name]: value
        })
    }

    return (
        <>
            <PageHeader>
                <div className='formWrapper login mx-auto py-5 mt-5 mb-5'>
                    <h1 className='fs-2 fw-semibold mb-4'>Register</h1>
                    <form >

                        <div className='form-group mb-4'>
                            <label htmlFor="email" className='mb-2 boldMedium'>Email</label>
                            <input name='email' value={registerFormData.email || ''} onChange={handleInput} className='form-control' type='email' id='email' placeholder="yormail@gmail.com" />
                        </div>

                        <div className='form-group  mb-4'>
                            <label htmlFor="phone" className='mb-2 boldMedium'>Phone Number</label>
                            <input name='phoneNumber' value={registerFormData.phoneNumber || ''} onChange={handleInput} className='form-control' type='email' id='phone' placeholder="+91 999 999 9999" />
                            {/* <p style={{fontSize: '14px'}}><small>In order to login with Phone Number, you need to verify the phone number</small></p> */}
                        </div>

                        <div className='form-group mb-4'>
                            <label htmlFor="password" className='mb-2 boldMedium'>Password</label>
                            <input name='password' value={registerFormData.password || ''} onChange={handleInput} className='form-control' type='password' id='password' placeholder="Password" />
                            
                        </div>

                        <div className='form-group'>
                            <label htmlFor="cpassword" className='mb-2 boldMedium'>Confirm Password</label>
                            <input name='confirmPass' value={registerFormData.confirmPass || ''} onChange={handleInput} className='form-control' type='password' id='cpassword' placeholder="Password" />
                            
                        </div>

                        {error.show && <Alert className='mt-3' onClose={() => setError({...error, show: false})} variant="danger" dismissible>{error.msg}</Alert>}

                        <div className='form-group text-center mt-4'>
                            <button onClick={registerHandler} className='rounded px-5 py-2 btn btn-primary'>Register</button>
                        </div>

                    </form>
                </div>
            </PageHeader>

        </>
    )
}

export default Register;