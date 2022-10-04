import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import '../styles/scss/pages/home.scss'
import { Col, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import PageHeader from '../snippets/PageHeader';

const Home = () => {
    return (
        <>
            <PageHeader>
                <div className='text-center homeBannerCont'>
                    <h1 className='title'>Create beautiful, professional <span className='d-block'>resumes in minutes, free.</span></h1>
                    <Button  as={Link} to="/createcv" variant="primary" className='rounded px-5 py-2'>Create It Now</Button>
                </div>
            </PageHeader>

            <Container as="section" className='afterBanner'>
                <Row>
                    <Col lg="3">
                        <div className='box w-100 text-center bg-white px-2 py-4'>
                            <h2 className='title mb-3'>Heading</h2>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, debitis tempore! Quos, magni nesciunt!</p>
                        </div>
                    </Col>
                    <Col lg="3">
                    <div className='box w-100 text-center bg-white px-2 py-4 center'>
                            <h2 className='title mb-3'>Heading</h2>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, debitis tempore! Quos, magni nesciunt!</p>
                        </div>
                    </Col>
                    <Col lg="3">
                    <div className='box w-100 text-center bg-white px-2 py-4 center'>
                            <h2 className='title mb-3'>Heading</h2>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, debitis tempore! Quos, magni nesciunt!</p>
                        </div>
                    </Col>
                    <Col lg="3">
                    <div className='box w-100 text-center bg-white px-2 py-4'>
                            <h2 className='title mb-3'>Heading</h2>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, debitis tempore! Quos, magni nesciunt!</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Home;