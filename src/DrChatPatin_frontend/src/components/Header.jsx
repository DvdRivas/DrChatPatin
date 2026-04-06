import DRClogo from '../assets/chatpatin2.png'
import { Menu, Edit } from "@mui/icons-material"; 

function Header(props) {

    return (
        <header className="chat-header" style={{background: !props.colorScheme && '#fbfbfb',  borderBottom: !props.colorScheme && '#fbfbfb' }}>
            <div className='sidebar-c' style={{color: !props.colorScheme && 'black', background: !props.colorScheme && '#fbfbfb', borderRight: !props.colorScheme && '#fbfbfb' }}>
            <div className='sidebar-header' style={{background: !props.colorScheme && '#fbfbfb',  borderRight: !props.colorScheme && '#fbfbfb'}}>
                <button className="icon-button" style={{color: !props.colorScheme && 'black'}} onClick={() => props.handleMenu(!props.sidebar)}>
                    <Menu />
                </button>
            <div className="sidebar-title" style={{color: !props.colorScheme && 'black' }}>New Chat</div>
            <button className='icon-button' style={{color: !props.colorScheme && 'black'}} onClick={()=>props.handleMainMenu(!props.onMainMenu)}>
                <Edit />
            </button>

            </div>
            </div>
            
            <div className='header-text'style={{color: !props.colorScheme && 'black'}}> DrChatPatin </div>
            <div className="header-logo">
                <img src={DRClogo} className={`logo-conv ${ props.colorScheme ? "header-logo-dark" : "header-logo-light"} ${ props.waitingResponse ? "blinking" : ""}`} alt="DrChatPatin logo"/>
            </div>
        </header>
    )
}

export default Header