import Container from 'react-bootstrap/Container';

import Mainmenu from '../snippets/Mainmenu';

const PageHeader = (props) =>{
    return (
        <Container as="header" className='bg-white mainHeader pt-3'>
            <Mainmenu />
            {props.children}

            <div className='circle one'></div>
            <div className='circle two'></div>
        </Container>
    )
}


export default PageHeader;