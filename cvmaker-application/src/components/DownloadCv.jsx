import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../snippets/PageHeader";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import '../styles/scss/pages/previewcv.scss';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logOut } from "../store/authSlice";

const DownloadCv = () => {
    const cvs = useSelector((state) => state.cv.cvData);
    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [previewData, setPreviewData] = useState([]);
    const [cvFetched, setCvFetched] = useState(false);
    const [layout, setLayout] = useState([

        /* {
            id: '1',
            type: ''
        },
        {
            id: '2',
            type: ''
        },
        {
            id: '3',
            type: ''
        },
        {
            id: '4',
            type: ''
        },
        {
            id: '5',
            type: ''
        } */
    ])
    useEffect(() => {
        if (cvs.length === 0 && !cvFetched) {
            console.log('cvFetched')
            console.log(cvFetched)
            fetchcv();
        } else {
            console.log(id)
            const filterFromCollection = cvs.filter((item, index) => {
                return item._id === id
            })
            setPreviewData(filterFromCollection);
        }

    }, []);


    

    function fetchcv() {
        setCvFetched(true)
        //console.log(id)
        axios({
            method: 'post',
            url: '/single-cv',
            data: {
                cv_id: id,
                withCredentials: true,
                headers: { crossDomain: true, 'Content-Type': 'application/json', sameSite: true }

            }
        }).then((e) => {
            console.log(e.data)
            //setCvs(e.data)
            setPreviewData(e.data)
            //dispatch( storeCvData(e.data) )
        }).catch((err) => {
            console.log(err);
            if (err.response.data.userStatus === 'dead') {
                dispatch(logOut());
                navigate('/signin');
            }
        });
    }
    return (
        <>
            <PageHeader className="py-4">
                <Container>
                    <Row>
                        <Col md="12" className="mb-4">
                            <h1 className="text-center">Choose Template </h1>
                            <p className="text-center">For now only one layout available</p>
                            <div className="mt-3 text-center">
                                <Link to="/mycvs" className="rounded px-5 py-2 btn btn-primary">Back to List</Link>
                            </div>
                        </Col>
                        {layout.length > 0 && layout.map((item, index) => <Col key={item.id} style={{ maxWidth: '200px' }}>
                            <div className="border p-2 bg-warning rounded" style={{ height: '210px' }}>
                            </div>
                        </Col>)}
                    </Row>
                </Container>
            </PageHeader>

            {previewData.length !== 0 && <div className="previewCv mx-auto bg-white p-3 my-5 shadow">
                <div className="row">
                    <div className="col-3">
                        <img src="/assets/images/businessman.png" alt="" className="img-fluid profileImg border" />
                    </div>
                    <div className="col-9">
                        <h1 className="jobTitle mb-0">{previewData[0].data[0].jobTitle}</h1>

                        <div className="generalInfo mt-2">
                            <div>
                                <p className="mb-1"><span className="fw-semibold">Name</span>: {previewData[0].data[0].firstname + ' ' + previewData[0].data[0].lastname}</p>
                                <p className="mb-1"><span className="fw-semibold">DOB</span>: {previewData[0].data[0].dob}</p>
                                <p className="mb-1"><span className="fw-semibold">Gender</span>: {previewData[0].data[0].gender}</p>
                                <p className="mb-1"><span className="fw-semibold">Address</span>: {previewData[0].data[0].address + ' ' + previewData[0].data[0].city} <br />{previewData[0].data[0].state} - {previewData[0].data[0].zipcode} ({previewData[0].data[0].country})</p>
                            </div>

                            <ul className="list-unstyled d-flex">
                                <li className="me-2"><span className="fw-semibold">Contact</span>:</li>
                                <li><Link to={'mailto:' + previewData[0].data[0].email} className="me-4">{previewData[0].data[0].email}</Link></li>
                                <li><Link to={'tel:' + previewData[0].data[0].zipcode}>{previewData[0].data[0].phone}</Link></li>
                            </ul>

                        </div>
                    </div>
                    <div className="col-12">
                        <div className="objective">
                            <h2 className="title2">Objective</h2>
                            <div dangerouslySetInnerHTML={{ __html: previewData[0].data[0].objective }}></div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="objective">
                            <h2 className="title2">Skills</h2>
                            <ul className="d-flex flex-wrap ps-3">
                                {previewData[0].data[0].skill && previewData[0].data[0].skill.map((item, index) => <li key={index} className="me-4 mb-2">{item.name}</li>)}
                                {/* <li className="me-4 mb-2">HTML</li>
                            <li className="me-4 mb-2">CSS</li>
                            <li className="me-4 mb-2">JavaScript</li>
                            <li className="me-4 mb-2">jQuery</li>
                            <li className="me-4 mb-2">Reactjs</li>
                            <li className="me-4 mb-2">Vuejs</li>
                            <li className="me-4 mb-2">Redux</li>
                            <li className="me-4 mb-2">Context API</li>
                            <li className="me-4 mb-2">WordPress</li> */}
                            </ul>
                        </div>
                    </div>
                    {previewData[0].data[0].experericeData && <div className="col-12">
                        <div className="objective mb-3">
                            <h2 className="title2">Experience</h2>
                        </div>
                        {previewData[0].data[0].experericeData.map((exp, index) => <div key={index} className="experienceWrapper">
                            <h3 className="title3">{exp.jobTitle}</h3>
                            <h4>{exp.employer}</h4>
                            <h4>From: {exp.startDate} to {exp.endDate}</h4>
                            <div className="workDescription" dangerouslySetInnerHTML={{ __html: exp.workDescription }} ></div>
                        </div>)}
                        {/* <div className="experienceWrapper">
                        <h3 className="title3">Work Title</h3>
                        <h4>Employer, India</h4>
                        <h4>From: 2/2/2015 to 15/15/2015</h4>
                        <div className="workDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam sit quia laboriosam iure corrupti ab necessitatibus, sunt molestias nemo iusto rem similique fuga iste earum explicabo id neque pariatur voluptatem.</div>
                    </div>
                    <div className="experienceWrapper">
                        <h3 className="title3">Work Title</h3>
                        <h4>Employer, India</h4>
                        <h4>From: 2/2/2015 to 15/15/2015</h4>
                        <div className="workDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam sit quia laboriosam iure corrupti ab necessitatibus, sunt molestias nemo iusto rem similique fuga iste earum explicabo id neque pariatur voluptatem.</div>
                    </div> */}
                    </div>}

                    {previewData[0].data[0].qualificationData && <div className="col-12">
                        <div className="objective mb-3">
                            <h2 className="title2">Education and Qualification</h2>
                        </div>
                        {previewData[0].data[0].qualificationData.map((quali, index) => <div key={index} className="experienceWrapper">
                            <h3 className="title3">{quali.degree}</h3>
                            <h4>{quali.school}, {quali.city}</h4>
                            <h4>From: {quali.startDate} to {quali.endDate}</h4>
                            <div className="workDescription" dangerouslySetInnerHTML={{ __html: quali.description }}></div>
                        </div>)}
                        {/* <div className="experienceWrapper">
                        <h3 className="title3">Degree Name</h3>
                        <h4>School/College, City/Town</h4>
                        <h4>From: 2/2/2015 to 15/15/2015</h4>
                        <div className="workDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam sit quia laboriosam iure corrupti ab necessitatibus, sunt molestias nemo iusto rem similique fuga iste earum explicabo id neque pariatur voluptatem.</div>
                    </div>
                    <div className="experienceWrapper">
                        <h3 className="title3">Degree Name</h3>
                        <h4>School/College, City/Town</h4>
                        <h4>From: 2/2/2015 to 15/15/2015</h4>
                        <div className="workDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam sit quia laboriosam iure corrupti ab necessitatibus, sunt molestias nemo iusto rem similique fuga iste earum explicabo id neque pariatur voluptatem.</div>
                    </div> */}
                    </div>}
                </div>
            </div>}
        </>
    )
}

export default DownloadCv;