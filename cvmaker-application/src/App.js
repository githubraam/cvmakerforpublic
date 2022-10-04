import './styles'

import Home from './components/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signin from './components/Sign';
import Forgotpassword from './components/Forgotpassword';
import Register from './components/Register';
import CreateCv from './components/CreateCv';
//import Mycvs from './components/Mycvs';
import DownloadCv from './components/DownloadCv';
import PageNotFound from './components/PageNotFound';
import { useDispatch, useSelector } from 'react-redux';
import { logIn } from './store/authSlice';
import React, { Suspense, useEffect, useState } from 'react';
import StickyMsg from './snippets/StickyMsg';
import axios from 'axios';
import MyProfile from './components/MyProfile';
import PageLoader from './snippets/PageLoader';
import FormLayout from './forms/Form';
const Mycvs = React.lazy(() => import('./components/Mycvs'));



axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.withCredentials = true;

function App() {
  const stickyShow = useSelector((state)=>state.stickMsg.show)
  const stickyMsg = useSelector((state)=>state.stickMsg.msg)
  const stickyType = useSelector((state)=>state.stickMsg.type)
  const stickyTitle = useSelector((state)=>state.stickMsg.title)
  console.log(stickyShow)

  const [stickyMsgData, setStikcyMsgData] = useState({

  })

  

  useEffect(()=>{
    setStikcyMsgData({
      show : stickyShow,
      title: stickyTitle,
      type : stickyType,
      msg : stickyMsg
    })
  },[stickyShow,stickyType,stickyMsg,stickyTitle])

  const dispatch = useDispatch();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    //console.log(isLoggedIn)

    if(isLoggedIn){
      dispatch( logIn() )
    }
    
  }, []);

  /* axios.get('/token').then((res)=>{
    console.log('res: '+res.data)
  }) */



  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        } />
        <Route path="/signin" element={<Suspense fallback={<PageLoader />}><Signin /></Suspense>} />
        <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><Forgotpassword /></Suspense>} />    
        <Route path="/register" element={<Suspense fallback={<PageLoader />}><Register /></Suspense>} />  
        <Route path="/createcv" element={<Suspense fallback={<PageLoader />}><CreateCv /></Suspense>} /> 
        <Route path="/cvedit/:id" element={<Suspense fallback={<PageLoader />}><CreateCv /></Suspense>} /> 
        <Route path="/mycvs" element={
          <Suspense fallback={<PageLoader />}>
            <Mycvs />
          </Suspense>
        } />
        <Route path="/profile" element={<MyProfile /> } />
        <Route path="/mycvs/download" >
          <Route path=":id" element={<DownloadCv />} />
        </Route>
        <Route path="/form" element={<FormLayout />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <StickyMsg show={stickyMsgData.show} type={stickyMsgData.type} msg={stickyMsgData.msg} title={stickyMsgData.title} />
    </BrowserRouter>
    
  );
}

export default App;
