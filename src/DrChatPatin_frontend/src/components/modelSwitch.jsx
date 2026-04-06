import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function ModelSwitch(props) {
  const handleChange = (event) => {
    localStorage.setItem("model", event.target.checked? 1 : 0)
    props.setModel(event.target.checked ? 1 : 0);
  };

  return (
    <div className={!props.sidebar? "model":"model-c"}> 
      <FormControlLabel
        control={
          <Switch
            checked={props.model === 1}
            onChange={handleChange}
            color="primary"
            className="!scale-110"
          />
        }
        label={props.model === 1 ? 'RAG Enabled' : 'RAG Inactive'} 
      />
    </div>
  );
}
