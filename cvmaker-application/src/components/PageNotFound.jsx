import { Button } from 'react-bootstrap';
import '../styles/scss/pages/404.scss';
import { Link } from 'react-router-dom';
const PageNotFound = () =>{
    return(
        <div className="mainContaienr">
            <div className='container bg-dark rounded shadow'>
                <div className="row">
                    <div className="col-4 leftImg" style={{backgroundImage: 'url("./assets/images/cat.jpg")'}}></div>
                    <div className="col-8 py-5 text-white text-center">
                        <div className="errorTitle d-flex justify-content-center">
                            <h1>404</h1>
                        </div>
                        <h2 className='text-center secondTitle mt-3'>Do not worry, it's just a <br/>404 ERROR</h2>
                        <Button as={Link} to="/" className='px-4' variant="primary">Back to home</Button>
                    </div>
                </div>
            </div>
          
        </div>
    )
}

export default PageNotFound;