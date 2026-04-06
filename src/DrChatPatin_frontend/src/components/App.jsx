import { useState, useEffect, useRef } from 'react';
// import { DrChatPatin_backend } from '../../../declarations/DrChatPatin_backend'; 
import MainPage from './MainPage'
import LateralMenu from './LateralMenu';
import Conversation from "./Conversation"
import SchemeSwitch from './Switch';
import { Decrypt, Encrypt } from './Cipher';

function App(props) {
  ///////////////// BACKEND/FETCH /////////////
  const DrChatPatin_backend = props.actor
  const identity = props.identity
  const [database, updateDatabase] = useState(null)
  const databaseRef = useRef(null)
  
  useEffect(() => {
    fetchDatabase()
    setCurrentConverID(localStorage.getItem('converID'))
    converIdRef.current = localStorage.getItem('converID')
  }, [])



  async function fetchDatabase() {
    let fetchedData = await DrChatPatin_backend.ReadChatList()
    databaseRef.current = fetchedData
    updateDatabase(fetchedData)
    
  }


  ///////////////// MAIN PAGE ///////////////
  const [onMainMenu, onMainMenuStatus] = useState(true)

  function handleMenu() {
    menuStatus(!sidebar)
    localStorage.setItem('sidebar', !sidebar)
  }

  function handleMainMenu(){
    converIdRef.current = 0 // useRef
    setCurrentConverID(0) // useState
    onMainMenuStatus(true)
  }

  ///////////////// CONVERSATION ///////////////

  const [question, questionState] = useState("")
  const [currentConverID, setCurrentConverID] = useState(0)
  const [currentConver, setCurrentConver] = useState(null)
  const converIdRef = useRef(0)
  const converRef = useRef([])


  async function handleSendInChat() {
    setWaitingResponse(true)

    const message = { sender: "user", text: question };
    questionState("");
    var updatedConver = [...currentConver.chat, message];
    var jsonString = JSON.stringify(updatedConver);
    var encryptedData = await Encrypt(jsonString);
    var encripetdString = JSON.stringify(encryptedData);
    await DrChatPatin_backend.UpdateDatabase(currentConverID, encripetdString);
    await fetchDatabase()
    await findConver(currentConverID)

    const answer = await getAnswer(encryptedData);
    updatedConver = [...updatedConver, answer];
    jsonString = JSON.stringify(updatedConver);
    encryptedData = await Encrypt(jsonString);
    encripetdString = JSON.stringify(encryptedData);

    await DrChatPatin_backend.UpdateDatabase(currentConverID, encripetdString);
    await fetchDatabase()
    await findConver(currentConverID)
    
    setWaitingResponse(false)

  }



  ///////////////// SIDEBAR ///////////////

  async function deleteConver(id) {
    await DrChatPatin_backend.DeleteChat(id)
    await fetchDatabase()
    onMainMenuStatus(true)
    console.log("delete note", id)
  }

  function editTitle(id) {
    console.log("edit note", id)

  }


  async function findConver(id) {
    converRef.current = databaseRef.current.find(item => String(item.id) == String(id)) // useRef
    const conver = databaseRef.current.find(item => String(item.id) === String(id)) // useState
    const chat = await Decrypt(JSON.parse(conver.chat))
    const history = {
      id: conver.id,
      title: conver.title,
      chat: JSON.parse(chat)
    }
    
    setCurrentConver(history)
    converRef.current = history
  }


  ///////////////// GENERAL ///////////////
  const [colorScheme, setColorScheme] = useState(() => {
  const stored = localStorage.getItem("color-scheme");
  return stored !== null ? stored === "true" : false;
  });
  const [sidebar, menuStatus] = useState(() => {
  const stored = localStorage.getItem("sidebar");
  return stored !== null ? stored === "true" : true;
  });

  const [waitingResponse, setWaitingResponse] = useState(false)
  const [model, setModel] = useState(() => {
    const stored = localStorage.getItem("model");
    return stored !== null? Number(stored) : 0;
    });

  async function handleSend() {
    if (!question.trim()) return;
    
    setWaitingResponse(true)

    const firstMessage = { sender: "user", text: question };
    questionState("");
    const initialChatHistory = [firstMessage];
    var jsonString = JSON.stringify(initialChatHistory);
    var encryptedData = await Encrypt(jsonString);
    var encripetdString = JSON.stringify(encryptedData);

    const updatedUserInfo = await DrChatPatin_backend.NewChat(encripetdString);

    const newChatId = updatedUserInfo.currentID;
    localStorage.setItem('converID', newChatId)
    databaseRef.current = updatedUserInfo.chats; // useRef 
  
    converIdRef.current = newChatId; //useRef
    setCurrentConverID(newChatId); //useState
    await findConver(newChatId)
    onMainMenuStatus(false);
    
    const answer = await getAnswer(encryptedData);
    const updatedConver = [...initialChatHistory, answer];

    jsonString = JSON.stringify(updatedConver);
    encryptedData = await Encrypt(jsonString);
    encripetdString = JSON.stringify(encryptedData);

    await DrChatPatin_backend.UpdateDatabase(newChatId, encripetdString);
    await fetchDatabase()
    await findConver(newChatId)
    
    setWaitingResponse(false)
  }
  

  async function handleClickInChat(id){
    localStorage.setItem('converID', id)
    converIdRef.current = id  // useRef
    setCurrentConverID(id) // useState
    await findConver(id)
    onMainMenuStatus(false)

}
  
  function handleColorScheme(event){
    localStorage.setItem("color-scheme", event.target.checked)
    setColorScheme(event.target.checked)
  }

  async function getAnswer(query){
    // const answer_enc = await DrChatPatin_backend.GetAnswer('User', query.iv, query.encripted, converIdRef.current, model)
    var apiUrl = ""; 
    if(model == 1) {
      apiUrl = process.env.USE_RAG
    } else {
      apiUrl = process.env.DIFFERENTIAL_DIAGNOSIS
    }

    const respuesta = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query), 
    });
    const resultado = await respuesta.json();

    const answer_dec = await Decrypt(resultado)
    const answer_json = {"sender": "bot", "text": answer_dec}
    return answer_json
}

  async function sendData(event) {
    event.preventDefault();
    const apiUrl = process.env.SAVE_DATA; 

    const jsonString = JSON.stringify(currentConver.chat)
    const payload = await Encrypt(jsonString);

    const respuesta = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), 
    });

    const resultado = await respuesta.json();
    alert(`✅ La conversación se ha guardado exitosamente.
    Agradecemos su cooperación; con su ayuda, mejoramos continuamente el sistema.
    Le recordamos que toda la información es anónima y confidencial.`);
    console.log(resultado);
}

  useEffect(() => {
   
    if (colorScheme) {
      document.body.style.backgroundColor = '#1e1e1e'; // Fondo oscuro
      document.body.style.color = '#e0e0e0'; // Texto claro
    } else {
      document.body.style.backgroundColor = '#e2e6ea'; // Fondo claro
      document.body.style.color = '#000000'; // Texto oscuro
    }
  }, [colorScheme]);

  return (
    <div>
      
      { sidebar && 
      <LateralMenu 
      sidebar={sidebar} 
      handleMenu={handleMenu} 
      onMainMenu={onMainMenu} 
      handleMainMenu={handleMainMenu}
      database = {database}
      handleClickInChat = {handleClickInChat}
      converId = {converIdRef.current}
      colorScheme = {colorScheme}
      deleteConver = {deleteConver}
      editTitle = {editTitle}
      />}

      { onMainMenu? 
      <MainPage 
      question = {question}
      handleSend = {handleSend}
      questionState = {questionState}
      colorScheme = {colorScheme}
      sidebar={sidebar} 
      handleMenu={handleMenu} 
      onMainMenu={onMainMenu} 
      handleMainMenu={handleMainMenu} 
      sendData={sendData}
      model={model}
      setModel={setModel}

      /> : 
      <Conversation 
      question = {question}
      handleSendInChat = {handleSendInChat}
      questionState = {questionState}
      colorScheme = {colorScheme}
      sidebar = {sidebar} 
      handleMenu = {handleMenu} 
      onMainMenu={onMainMenu} 
      handleMainMenu={handleMainMenu}
      conver = {currentConver.chat}
      waitingResponse = {waitingResponse}
      sendData={sendData}
      model={model}
      setModel={setModel}
      />}
      
      <SchemeSwitch 
      colorScheme = {colorScheme}
      handleColorScheme = {handleColorScheme}
      />
      
    </div>
  );
}

export default App;
