import { useState } from "react";
import { Container } from "react-bootstrap";

const FormLayout = () =>{

    return(
        <Container>
            <h1>Form</h1>
            <input type="text"  className="form-control mb-3" placeholder="Username" autoComplete ="off" />
            <input type="password" value='' className="form-control mb-3" placeholder="password" autoComplete ="off" />
            <button className="btn btn-primary">Submit</button>

            <div className="mt-4">
                <h2>Results</h2>
               
            </div>
        </Container>
        
    )
}

export default FormLayout;