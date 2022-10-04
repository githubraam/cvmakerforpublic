import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../snippets/Loader";
import PageHeader from "../snippets/PageHeader";
import { userInfo } from "../store/authSlice";
import { logOut } from "../store/authSlice";
const MyProfile = () =>{
    const userData = useSelector((state)=>state.auth.userData);
    const [profileInfo, setProfileInfo] = useState({});
    const [enableLoader, setEnableLoader] = useState(false);
    //console.log(userData)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        if( Object.keys(userData).length === 0 ){
            /* fetchProfile(); */
            dispatch( logOut() );
            navigate('/signin');
        }
        else{
            setProfileInfo(userData)
        }
    },[])

    function handleForm(e){
        setProfileInfo({
            ...profileInfo,
            [e.target.name] : e.target.value
        })
        dispatch( userInfo(profileInfo) )
    }

   function updateProfileHandler(){
    setEnableLoader(true);
        axios({
            method: 'post',
            url: '/update-profile',
            data: {
                ...profileInfo,
                
            }
        }).then((e)=>{
            //console.log(e.data)
            setEnableLoader(false)
        }).catch((err)=>{
            console.log(err);
            if(err.response.data.userStatus==='dead'){
                dispatch( logOut() );
                navigate('/signin');
            }
        });
    } 
    return(
        <>
        <PageHeader>
            <div className="text-center pt-5 pb-5">
                <h1 className='fs-2 fw-semibold mb-4'>Profile</h1>
            </div>
        </PageHeader>
        <Container className="mt-5 bg-white p-4 shadow rounded">
            <Form onSubmit={(e)=>{e.preventDefault()}}>
                <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" name="firstName" onChange={handleForm} value={profileInfo.firstName || ''}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" name="lastName" onChange={handleForm} value={profileInfo.lastName || ''}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" name="password" onChange={handleForm} value={profileInfo.phoneNumber || ''}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" disabled={true} value={profileInfo.email || ''}></Form.Control>
                    <Form.Text className="text-muted">Email cannot be changed</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" disabled={true} value={profileInfo.password || ''}></Form.Control>
                    <Form.Text className="text-muted">To update the password, navigate to forgot password after logout</Form.Text>
                </Form.Group>

                {enableLoader && <Form.Group className="mb-3">
                <Loader />
                </Form.Group>}
                <Button variant="primary" type="submit" className="me-3" onClick={updateProfileHandler} >Save</Button>
                

                
            </Form>
        </Container>
        </>
    )
}

export default MyProfile;