import { useState, useRef, useEffect } from 'react';
import NearMeSharpIcon from '@mui/icons-material/NearMeSharp';
import Header from './Header';
import Dictaphone from './Dictaphone';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';
import ModelSwitch from './modelSwitch';

// ========================================================================
// CONFIGURACIÓN DE MARKED PARA MANEJAR EL RAZONAMIENTO
// ========================================================================

const renderer = new marked.Renderer();

function formatMessageWithReasoning(text) {
  if (typeof text !== 'string') text = String(text);

  // Detecta si hay razonamiento (Thinking... o líneas con >)
  const reasoningRegex = /(Thinking[\s\S]*?)(?=\n{2,}|$)/i;
  const match = text.match(reasoningRegex);

  let reasoningPart = '';
  let responsePart = text;

  if (match) {
    reasoningPart = match[1].trim();
    responsePart = text.replace(reasoningRegex, '').trim();
  }

  let html = '';

  if (reasoningPart) {
    html += `
      <details class="reasoning-details">
        <summary class="reasoning-summary">Ver razonamiento del modelo</summary>
        <div class="reasoning-content">
          ${marked.parse(reasoningPart)}
        </div>
      </details>
    `;
  }

  if (responsePart) {
    html += marked.parse(responsePart);
  }

  return html;
}

marked.use({
  renderer,
  breaks: true,
  gfm: true,
});
// ========================================================================

function Conversation(props) {
  const [focus, focusState] = useState(false);
  const chatEndRef = useRef(null);

  function handleState(event) {
    props.questionState(event.target.value);
  }

  function handleSendClick(event) {
    event.preventDefault(); 
    props.handleSendInChat();
  }

  useEffect(() => {
  if (chatEndRef.current) {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
  }, [props.conver]);

  return (
    <div className="chat-container" style={{background: !props.colorScheme && '#e2e6ea'}}>
      
      <Header 
        colorScheme={props.colorScheme} 
        sidebar={props.sidebar} 
        handleMenu={props.handleMenu} 
        onMainMenu={props.onMainMenu} 
        handleMainMenu={props.handleMainMenu} 
        waitingResponse={props.waitingResponse}
      />
      <ModelSwitch model={props.model} setModel={props.setModel} sidebar={props.sidebar}/>
      
      
      <div className="chat-content">
        <div className={!props.sidebar ? "chat-box" : "chat-box-c"} style={{ background: !props.colorScheme && '#e2e6ea', height: props.waitingResponse ? 'calc(97vh - 260px)' : (focus ?  'calc(100vh - 260px)' : 'calc(107vh - 260px)'), transition: 'padding-bottom 0.3s ease' }}>
          {props.conver.map((msg, index) => (
            <div 
              key={index} 
              className={msg.sender === "user" ? "message-user" : "message-bot"}
              style={{
                background: msg.sender === "user"
                  ? (!props.colorScheme && '#b3d1f0')
                  : (!props.colorScheme && '#e2e6ea'),
                color: !props.colorScheme && 'black'
              }}
            >
              {msg.sender === "user" ? (
                msg.text
              ) : (

                <div 
                  className={`reasoning-wrapper ${'reasoning-dark'}`}
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(formatMessageWithReasoning(msg.text))
                  }} 
                />
              )}
            </div>
          ))}
        <div ref={chatEndRef} />

        </div>
      </div>
      
 
      <form className={"form-conv"} style={props.sidebar ? {left:"63%",  bottom: "35px" } : {left:"50%"}} onFocus={() => focusState(true)} onBlur={() => focusState(false)}>
        <textarea
          name="question"
          onChange={handleState}
          value={props.question}
          placeholder="What are the patient's symptoms?..."
          rows={focus ? 6 : 1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !props.waitingResponse) {
              e.preventDefault();
              handleSendClick(e);
              focusState(false)
            }}}
        ></textarea>
        
        <Dictaphone questionState={props.questionState}/>
        <button className={'form-button-send-data'} onClick={() => props.sendData(event)}> <SendAndArchiveIcon/> </button>
        <button className={'form-button-send'} onClick={handleSendClick} disabled={props.waitingResponse}>
          <NearMeSharpIcon />
        </button>
      </form>
    </div>
  );
}

export default Conversation;