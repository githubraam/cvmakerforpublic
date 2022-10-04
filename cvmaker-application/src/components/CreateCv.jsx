import PageHeader from "../snippets/PageHeader";
import Container from 'react-bootstrap/Container';
import { Button, Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/scss/pages/createcv.scss'
const CreateCv = () =>{
    

    const [profileImg, setProfileImg] = useState({})
    const [profileStaticImg, setProfileStaticImg] = useState('')
    
    let navigate = useNavigate();
    const [objective,setObjective] = useState('');
    const [cvData, setcvData] = useState({
        qualificationData:[],
        skill: [],
        experericeData: []
    });
    useEffect(() => {
        const getLocalData = localStorage.getItem("cvsData");
        if( getLocalData ){
            setcvData({...cvData}, JSON.parse(getLocalData) )
        }
        /* return () => {
            cleanup
        }; */
    }, []);
    const [additionalInfo, setAdditionalInfo] = useState(0);

    /* for Jodit editor */
    const [config] = useState({
        readonly: false, // all options from https://xdsoft.net/jodit/doc/,
		placeholder: 'Start typings...',
        image: false,
        disablePlugins:['image', 'file', 'video']
    })

    /* ending for Jodit editor */

    /* if edit mode */
    const [isCvEdit, setisCvEdit] = useState(false)
    const [cvId, setCvId] = useState('')
    let { id } = useParams();
    //console.log(id)

    useEffect(()=>{
        if( id ){
            setisCvEdit(!isCvEdit);
            setCvId(id);
            axios.post('/single-cv', {
                cv_id:id
            })
            .then(function (res) {             
                setcvData(res.data[0].data[0])
                
            })
            .catch(function (error) {
            });
        }

        return ()=>{
            id = '';
        }
    },[])

    
    /* end if edit mode */


    function addMoreExp(){
        //setExperienceData([...experericeData,expDataSchema])
        setcvData({...cvData},cvData.experericeData.push({}))
    }
    /* ending work expererice */



    function addMoreQualification(){
        setcvData({...cvData},cvData.qualificationData.push({}))
        //setQualificationData([...qualificationData,[]])
    }
    
    /* ending Qualification */

    /* skills */
    

    function addMoreSkill(){
        //setSkill([...skill,skillSchema])
        setcvData({...cvData},cvData.skill.push({}))
    }
    /* ending skills */

    function handleDynamicAddMoreForm(type,index,e){
        if( type==='experience' ){
            
            setcvData( {...cvData},cvData.experericeData[index][e.target.name]=e.target.value)
        }
        if( type==='experienceWork' ){
            //here 'e' will be treated as newContent
            
            setcvData( {...cvData},cvData.experericeData[index].workDescription=e)
        }

        if( type==='qualification' ){
            setcvData( {...cvData},cvData.qualificationData[index][e.target.name]=e.target.value)
            
        }

        if( type==='skills' ){
            
            setcvData( {...cvData},cvData.skill[index][e.target.name]=e.target.value)
        }
    }



    function handleInput(evt){
        const value = evt.target.value;
        setcvData({
            ...cvData,
            [evt.target.name]: value
        })
    }

    //console.log(profileImg)

    async function handleCvData(e){
        e.preventDefault();
        let cvDatas = {
            ...cvData,
            objective,
            
            //qualificationData: qualificationData,
            //skill: skill
        }
        //localStorage.setItem('cvCreatePending', true);
        

        try{
            let res = '';
            if( cvId ){               

                res = await axios.post('/updatecv',{
                    ...cvDatas,
                    profileImg
                },{ params: {
                    cvid: cvId
                  },
                  headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            }else{
                res = await axios.post('/createcv',{
                    ...cvDatas,
                    profileImg
                },{
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                })
            }

            /* const res = await axios.post(apiUrl,{
                ...cvDatas
            },{ params: {
                cvid: cvId
              }}) */

            //console.log(res)
            


            localStorage.removeItem('cvsData');
            navigate('/mycvs');
            
            //console.log(res)
        }catch(err){
            localStorage.setItem('cvsData', JSON.stringify(cvDatas));
            console.log(err)
        }

        
    }

    function handleShowAdditionalInfo(){
        setAdditionalInfo(additionalInfo+1)
    }

    function removeSkillHandler(index){
        let copiedData = [...cvData.skill];
        copiedData.splice(index,1);
        //setSkill(copiedData)
        setcvData({...cvData},cvData.skill=copiedData)
    }

    function removeWorkExpHandler(index){
        let copiedData = [...cvData.experericeData];
        copiedData.splice(index,1);
        //setExperienceData(copiedData)
        setcvData({...cvData},cvData.experericeData=copiedData)
    }


    const [hovered, setHovered] = useState({
    })

    function mouseEntered(target,index){
        setHovered({[target]:index});
    }
    function mouseLeaved(){
        setHovered({});
    }

    async function imageUploadHandeler(e){
        let trgFile = e.target.files[0];
        setProfileImg( trgFile );
        setProfileStaticImg(URL.createObjectURL(trgFile));

        /* try{
            const res = await axios.post('/uploadcv-image',{
                profileImg
            },{
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            console.log(res)
            //console.log(res)
        }catch(err){
            console.log(err)
        } */
    }
	


   
    return(
        <>
        <PageHeader >
            <div className="text-center py-5">
                <h1 className="fs-2">Start Creating a <span className="text-primary">Fresh CV</span> for your profession <br/> in  a few steps!</h1>
            </div>
            
        </PageHeader>
        <Container as="section" className="p-5 bg-white mt-5 rounded-4" style={{boxShadow: '0 5px 10px rgba(0,0,0,.25)'}}>
            
            <Row className="mb-4">
                <Col md="4" lg={3}>
                    <h2 className="fs-4">Upload Image</h2>
                    <div className="imageWrapper d-flex justify-content-center align-items-center rounded" style={{backgroundImage: 'url(' + profileStaticImg + ')'}}>
                        <label htmlFor="cvImage">Click to Upload</label>
                        <input type="file" id="cvImage" className="d-none"   onChange={ (e)=>{ imageUploadHandeler(e) }  } />
                    </div>
                </Col>
                <Col md="8" lg={9}>
                    <h2 className="fs-4">CV Title</h2>
                    <Form.Group className="mb-3">
                        <Form.Label>Job Title</Form.Label>
                        <Form.Control name="jobTitle" value={cvData.jobTitle || ''}  onChange={handleInput}  ></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Objective</Form.Label>

                        <JoditEditor
                        value={cvData.objective || ''}
                        config={config}
                        //onBlur={(newContent) => setobjective(newContent)}
                        onBlur={(newContent) =>  setObjective(newContent)} 
                        onChange={(newContent) => {}}
                        />


                        {/* <Form.Control style={{height: 'auto'}} as="textarea" rows={4} name="objective"  value={cvData.objective || ''}  onChange={handleInput}></Form.Control> */}
                    </Form.Group>
                </Col>
            </Row>
            <hr className="mb-4"/>

            <h2 className="fs-4">Basic Information</h2>
            <Row>
                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control name="firstname"  value={cvData.firstname || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>
                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control name="lastname" value={cvData.lastname || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>

                
                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" name="email" value={cvData.email || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>

                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control name="phone" value={cvData.phone || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>

                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name="dob" value={cvData.dob || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>

                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>Place of Birth</Form.Label>
                        <Form.Control type="text" name="birthPlace" value={cvData.birthPlace || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>

                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control type="text" name="gender" value={cvData.gender || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <hr className="mb-4 mt-4"/>

                <h2 className="fs-4">Address</h2>

                <Col md="12">
                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control name="address" value={cvData.address || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>
                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>City / Town</Form.Label>
                        <Form.Control name="city" value={cvData.city || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>

                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control name="state" value={cvData.state || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>

                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control name="country" value={cvData.country || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>

                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>Zipcode</Form.Label>
                        <Form.Control name="zipcode" value={cvData.zipcode || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <hr className="mb-4 mt-4"/>

                <h2 className="fs-4">Profile Links</h2>

                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>Linkedin</Form.Label>
                        <Form.Control name="linkedin" type="url" value={cvData.linkedin || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>

                <Col md="6">
                    <Form.Group className="mb-3">
                        <Form.Label>Website</Form.Label>
                        <Form.Control name="website" type="url" value={cvData.website || ''}  onChange={handleInput}></Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <hr className="mb-4 mt-4"/>
                <h2 className="fs-4">Skills</h2>
                <Col className="p-4 border">
                    {cvData.skill && cvData.skill.map((item,index)=><Row key={index}>
                        <Col md="12">
                            {index>0 && <hr/>}
                            <Badge className="mb-4" variant={'primary'}>{index+1}</Badge>
                        </Col>
                        <Col md="5">
                            <Form.Group className="mb-3">
                                <Form.Label>Skill</Form.Label>
                                <Form.Control name="name" type="text" value={item.name || ''}  onChange={(e)=>{handleDynamicAddMoreForm('skills',index,e)}}></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md="5">
                            <Form.Group className="mb-3">
                                <Form.Label>Level</Form.Label>
                                <Form.Select name="level" type="text" defaultValue={'Expert'} value={item.level}  onChange={(e)=>{handleDynamicAddMoreForm('skills',index,e)}}>
                                    <option>Expert</option>
                                    <option>Experienced</option>
                                    <option>SkillFull</option>
                                    <option>Intermediate</option>
                                    <option>Beginner</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md="2" className="d-flex justify-content-end align-items-end">
                            {index!==0 && <Button variant="danger" className="mb-3" onClick={()=>removeSkillHandler(index)}>x</Button>}
                        </Col>                      
                    </Row>)}

                    <Row>
                        <Col className="text-center mt-4">
                            <Button variant="dark" onClick={addMoreSkill}>Add More Skill</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {additionalInfo>0 && <Row>

                <hr className="mb-4 mt-4"/>

                <h2 className="fs-4">Work Exerience</h2>
                <Col className="p-4 border">
                    {cvData.experericeData && cvData.experericeData.map((exp,index)=><Row style={hovered.exp==index ? {outline: '1px solid red' }: {}} key={index}>
                        <Col md="12">
                            {index>0 && <hr/>}
                            <div className="d-flex justify-content-between">
                                <Badge className="mb-4" variant={'primary'}>{index+1}</Badge>
                                {index!==0 && <Button variant="danger" onClick={()=>removeWorkExpHandler(index)} onMouseLeave={mouseLeaved} onMouseEnter={()=>mouseEntered('exp',index)}>x</Button>}
                            </div>
                            
                        </Col>
                        <Col md="6">
                            <Form.Group className="mb-3">
                                <Form.Label>Job Title</Form.Label>
                                <Form.Control name="jobTitle" type="text" value={exp.jobTitle || ''}  onChange={(e)=>handleDynamicAddMoreForm('experience',index,e)}></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <Form.Group className="mb-3">
                                <Form.Label>City/Town</Form.Label>
                                <Form.Control name="jobCity" type="text" value={exp.jobCity || ''}  onChange={(e)=>handleDynamicAddMoreForm('experience',index,e)}></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md="12">
                            <Form.Group className="mb-3">
                                <Form.Label>Employer</Form.Label>
                                <Form.Control name="employer" type="text" value={exp.employer || ''}  onChange={(e)=>handleDynamicAddMoreForm('experience',index,e)}></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <Form.Group className="mb-3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control name="startDate" type="date" value={exp.startDate || ''}  onChange={(e)=>handleDynamicAddMoreForm('experience',index,e)}></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <Form.Group className="mb-3">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control name="endDate" type="date" value={exp.endDate || ''}  onChange={(e)=>handleDynamicAddMoreForm('experience',index,e)}></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md="12">
                            <Form.Group className="mb-3">
                                <Form.Label>Work Description</Form.Label>
                                <JoditEditor
                                value={exp.workDescription}
                                config={config}
                                onBlur={(newContent) => handleDynamicAddMoreForm('experienceWork',index,newContent)}
                                //onBlur={(newContent) => setworkDescription(newContent)}
                                onChange={(newContent) => {}}
                                />  
                                {/* <Form.Control name="workDescription" as="textarea" rows={3} type="date" value={cvData.workDescription || ''}  onChange={handleInput} style={{height: 'auto'}}></Form.Control> */}
                            </Form.Group>
                        </Col>
                    </Row>)}

                    <Row>
                        <Col className="text-center mt-4">
                            <Button variant="dark" onClick={addMoreExp}>Add More Experience</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>}


            {additionalInfo>1 && <Row>

                <hr className="mb-4 mt-4"/>

                <h2 className="fs-4">Education and Qualification</h2>
                <Col className="p-4 border">
                    {cvData.qualificationData && cvData.qualificationData.map((item,index)=><Row key={index}>
                        <Col md="12">
                            {index>0 && <hr/>}
                            <Badge className="mb-4" variant={'primary'}>{index+1}</Badge>
                        </Col>
                        <Col md="6">
                            <Form.Group className="mb-3">
                                <Form.Label>Degree</Form.Label>
                                <Form.Control name="degree" type="text" value={item.degree || ''}  onChange={(e)=>{handleDynamicAddMoreForm('qualification',index,e)}}></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <Form.Group className="mb-3">
                                <Form.Label>City/Town</Form.Label>
                                <Form.Control name="city" type="text" value={item.city || ''}  onChange={(e)=>{handleDynamicAddMoreForm('qualification',index,e)}}></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md="12">
                            <Form.Group className="mb-3">
                                <Form.Label>School</Form.Label>
                                <Form.Control name="school" type="text" value={item.school || ''}  onChange={(e)=>{handleDynamicAddMoreForm('qualification',index,e)}}></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <Form.Group className="mb-3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control name="startDate" type="date" value={item.startDate || ''}  onChange={(e)=>{handleDynamicAddMoreForm('qualification',index,e)}}></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <Form.Group className="mb-3">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control name="endDate" type="date" value={item.endDate || ''}  onChange={(e)=>{handleDynamicAddMoreForm('qualification',index,e)}}></Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md="12">
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} name="description" type="date" value={item.description || ''}  onChange={(e)=>{handleDynamicAddMoreForm('qualification',index,e)}} style={{height:"auto"}}></Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>)}

                    <Row>
                        <Col className="text-center mt-4">
                            <Button variant="dark" onClick={addMoreQualification}>Add More Qualification</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>}

            

            {additionalInfo!==2 && <Row>
                <Col className="text-center mt-4">

                    <Button variant="dark" className="px-5"  onClick={handleShowAdditionalInfo}>+ Additional Info</Button>
                    
                </Col>
            </Row>}
            {additionalInfo===2 && <Row>
                <Col className="text-center mt-4">
                    <button type="button" className="btn btn-primary" onClick={handleCvData} >Save</button>                    
                </Col>
            </Row>}
        </Container>
        </>
    )
}


export default CreateCv;