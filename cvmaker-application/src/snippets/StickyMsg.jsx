import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { closeStickyMSg } from "../store/stickyMsgSlice";

const StickyMsg = (props) =>{
    
    
    
    const [showMsg, setShowMsg] = useState(props.show);

    const dispatch = useDispatch();

    useEffect(() => {
       // console.log(props)
        setShowMsg(props.show);

        if( showMsg ){
           setTimeout(()=>{
                closeIt();
            },5000)
        }

        return function(){
            
        }
    }, [props.show, showMsg]);

    const classes = ['d-none'];
    switch(props.type){
        case 'error':
            classes.push('bg-danger');
            break;
        case 'success':
            classes.push('bg-info');
            break;
        case 'warning':
            classes.push('bg-warning');
            break;
        default:
            classes.push('bg-white');
    }
    if( props.show ){
        const indexOfItem = classes.indexOf("d-none");
        classes.splice(indexOfItem,1);
    }
    function closeIt(){
        dispatch( closeStickyMSg() )
    }
    return(
        <aside className={'position-fixed stickyMsg px-4 py-2 rounded shadow ' + classes} style={showMsg ? {right: '15px'}: {}} >
            <div style={{position: 'absolute', top: '-12px', right: 0, cursor: 'pointer'}} onClick={()=>closeIt()}>x</div>
            <div className="text fw-semibold">{props.title }</div>
            <div style={{fontSize: '14px'}}>{props.msg}</div>
        </aside>
    )
}

export default StickyMsg;