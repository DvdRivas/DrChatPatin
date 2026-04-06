
import { Menu, Edit, Search, } from "@mui/icons-material"; 
import DeleteIcon from '@mui/icons-material/Delete';



function LateralMenu(props) {
    

    return (
    <aside className="sidebar" style={{backgroundColor: !props.colorScheme && '#fbfbfb', borderRight: !props.colorScheme && '#fbfbfb' }}>
        <div className="sidebar-header" style={{color: !props.colorScheme && 'black'}}>
            <button className="icon-button" style={{color: !props.colorScheme && 'black'}} onClick={() => props.handleMenu(!props.sidebar)}>
            <Menu />
            </button>
            <div className="sidebar-title">New Chat</div>
            <button className='icon-button' style={{color: !props.colorScheme && 'black'}} onClick={()=>props.handleMainMenu(!props.onMainMenu)}>
                <Edit />
            </button>
        </div>


      <div className="sidebar-search" style={{background: !props.colorScheme && '#e2e6ea'}}>
        <Search className="icon-button" style={{color: !props.colorScheme && 'black'}}/>
        <input type="text" placeholder="Search" />
      </div>


      <nav>
        {props.database &&
        <ul className="sidebar-ul" >
          {props.database.map(({title, id}, index) => (
            <li style={{color: !props.colorScheme && 'black'}}
            key={id} 
            id={id} 
            className={props.converId == id? 'selected': ''}
            onClick={() => props.handleClickInChat(id)}> 
            {title} 
            <button onClick={() => props.editTitle(id)} className={"edit-icon"} > <Edit sx={{ fontSize: 20 }} /> </button>
            <button onClick={() => props.deleteConver(id)} className={"delete-icon"} >  <DeleteIcon sx={{ fontSize: 20 }}/> </button>   </li>))}
        </ul> }
      </nav>
    </aside>
    )
}

export default LateralMenu