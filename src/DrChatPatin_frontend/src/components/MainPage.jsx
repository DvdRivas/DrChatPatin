import { useState } from 'react';
import DRClogo from '../assets/chatpatin2.png'
import NearMeSharpIcon from '@mui/icons-material/NearMeSharp';
import { Menu } from "@mui/icons-material"; 
import Dictaphone from './Dictaphone';
import ModelSwitch from './modelSwitch';

function MainPage(props) {

    const [focus, focusState] = useState(false)

    function handleState(event){
        props.questionState(event.target.value)
    }

    

    return (
        <div >
            {!props.sidebar && <button className="menu-button" style={{color: !props.colorScheme && 'black'}} onClick={() => props.handleMenu(!props.sidebar)}>
                <Menu />
            </button>}
            <ModelSwitch model={props.model} setModel={props.setModel} sidebar = {props.sidebar}/>

            <div className={!props.sidebar? "div-main-c": "div-main"}>
                <img src={DRClogo} className='logo' alt='DrChatPatin logo'/>

                <h3>Hello, I'm DrChatPatin!. How can i help you today? </h3>
                <form onSubmit={() => event.preventDefault()} onFocus={() => focusState(true)} onBlur={() => focusState(false)}>
                    <textarea 
                    name="question"
                    onChange={handleState}
                    value={props.question}
                    placeholder="What are the patient's symptoms?..." 
                    rows={focus? 6 : 1}
                    onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !props.waitingResponse) {
                    e.preventDefault();
                    props.handleSend(e);
                    focusState(false)
                    }}}

                    > </textarea>
                    
                    <Dictaphone questionState = {props.questionState}/>
                    <button className={'form-button-send'} onClick={() => props.handleSend(event)} disabled={props.waitingResponse}>  <NearMeSharpIcon/> </button>
                </form>
            </div>
        
            
        </div>


    )
}

export default MainPage