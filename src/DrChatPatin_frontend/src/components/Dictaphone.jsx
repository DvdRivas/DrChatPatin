
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useEffect } from 'react';

function Dictaphone(props) {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
        } = useSpeechRecognition();

        if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
        }

        useEffect(() => {
            props.questionState(transcript);
        }, [transcript, props.questionState]);

        return (
        <div onSubmit={event.preventDefault()}>
            {listening? 
            <button className={'form-button-voice'} style={{color: "red"}}  onClick={SpeechRecognition.stopListening}> <MicOffIcon/> </button>:
            <button className={'form-button-voice'}  onClick={SpeechRecognition.startListening}> <KeyboardVoiceIcon/> </button>
            }
            
            {/* <button onClick={resetTranscript}>Reset</button> */}
        </div>
        );
    };

export default Dictaphone;

