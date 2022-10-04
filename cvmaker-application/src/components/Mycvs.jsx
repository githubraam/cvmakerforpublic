import { Container, Table, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../snippets/PageHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import StickyMsg from "../snippets/StickyMsg";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../store/authSlice";
import { removeOneCv, storeCvData } from "../store/cvSlice";
import { mongoDateFormat } from "../functions";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { setMsg } from "../store/stickyMsgSlice";


const Mycvs = () =>{
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [confirmDel, setConfirmDel] = useState(false);
    const [deletingCV, setDeletingCv] = useState(false)
    const [delId, setDelId] = useState('');
    const cvs = useSelector((state)=>state.cv.cvData);
    const [fetchingOnIntial, setFetchingOnInitial] = useState(true);
    //console.log(cvs)
    useEffect(() => {
        
        if(fetchingOnIntial){
            fetchcv()
        }
               
           
        return () => {
            setFetchingOnInitial(!fetchingOnIntial);
        };
    }, [fetchingOnIntial]);

    //const [cvs, setCvs] = useState([])

    function fetchcv(){
        
        axios({
            method: 'post',
        url: '/getcv',
        data: {
           // _id: '6310b83a71c64e5ec4e5e399',
            withCredentials: 'include',
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
            
        }
        }).then((e)=>{
            //console.log(e.data)
            //setCvs(e.data)
            
            dispatch( storeCvData(e.data) )
        }).catch((err)=>{
            console.log(err);
            if(err.response.data.userStatus==='dead'){
                dispatch( logOut() );
                navigate('/signin');
            }
        });
    }

    useEffect(()=>{
        if(deletingCV){
            deleteTheCv(delId)
        }      

    },[deletingCV,delId])




    function deleteTheCv(cvid){
        axios({
            method: 'post',
        url: '/removethe-cv',
        data: {
            cvid,
            withCredentials: 'include',
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
            
        }
        }).then((e)=>{
            setDeletingCv(false);
            setConfirmDel(false);
            dispatch( removeOneCv(delId) )
            dispatch( setMsg({show:true, type:'success', msg:'CV removed !', title: 'Success' }) )
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
                <h1 className='fs-2 fw-semibold mb-4'>CV's List <br/>Check All of your cvs here <br/>
                    <img src="/assets/images/down-arrow.png" width="50" alt="" title="scroll down" className="img-fluid mt-4" />
                    <br/>
                    or
                    <br/>
                </h1>
                <Link to="/createcv" className="rounded px-5 py-2 btn btn-primary">Create More CV</Link>
            </div>
            
        </PageHeader>

        <Container className="mt-4 py-4 bg-white shadow rounded">
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Created on</th>
                        <th>Download</th>
                        <th>Share as Link</th>
                        <th className="text-end">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cvs!==undefined && cvs.map((item,index)=><tr key={item._id.toString()}>
                        <td>{index+1}</td>
                        <td>{ mongoDateFormat(item.createdAt) }</td>
                        <td><Link to={`/mycvs/download/${item._id}`}>Download</Link> </td>
                        <td><Form.Check type="switch" label=""></Form.Check></td>
                        <td className="text-end">
                            <span className="me-3 cursor-pointer">
                                <Link to={`/cvedit/${item._id}`}>
                                    <img src="/assets/images/pencil.png" width={15} className="img-fluid" alt="" />
                                </Link>
                                
                            </span>
                            <span className="cursor-pointer" onClick={ ()=>{setConfirmDel(true); setDelId(item._id)}}>
                                <img src="/assets/images/rubbish-bin.png" width={15} className="img-fluid" alt="" />
                            </span>
                        </td>
                    </tr>)}
                </tbody>
            </Table>
        </Container>

        <Modal backdrop="static"
        keyboard={false} show={confirmDel} onHide={()=>{ setConfirmDel(false) }}>
        <Modal.Header>
          <Modal.Title>Delete ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Once Deleted cannot be reverted</Modal.Body>

        <Modal.Footer>
         
          <Button variant="primary" onClick={()=>{ setDeletingCv(true) }}>
            Yes, Delete
          </Button>

          <Button variant="danger" onClick={()=>{ setConfirmDel(false)}}>
            No, Return Back
          </Button>
        </Modal.Footer>
        
      </Modal>
        </>
        
    )
}

export default Mycvs;