import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import Disclaimer from './components/Disclaimer';
import './index.scss';
import { AuthClient } from '@dfinity/auth-client';
import { createActor, canisterId } from '../../declarations/DrChatPatin_backend';
import { HttpAgent } from '@dfinity/agent';

const environment = process.env.DFX_NETWORK === 'local';
const localHost = "http://localhost:4943";
const productionHost = "https://ic0.app";

const NFID_PROVIDER = "https://nfid.one/authenticate/?applicationName=DrChatPatin&applicationLogo=https://drchatpatin.uan.mx/logo.png";

async function init() {
  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    handleAuth(authClient);
    return;
  }

  await authClient.login({
    maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 días
    identityProvider: environment
      ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`
      : NFID_PROVIDER,
    
    windowOpenerFeatures: null, 
    
    onSuccess: async () => {
      await handleAuth(authClient);
      window.history.replaceState({}, document.title, "/");
    }
  });
}

async function logout() {
  const authClient = await AuthClient.create();
  await authClient.logout();
  window.location.reload();
}

async function handleAuth(authclient) {
  const identity = authclient.getIdentity();
  const agent = new HttpAgent({
    identity,
    host: environment ? localHost : productionHost,
  });
  const actor = createActor(canisterId, { agent });
  const user = identity.getPrincipal();

  const access = await actor.Verify();
  
 ReactDOM.createRoot(document.getElementById('root')).render( 
  <React.StrictMode> 
    {/* { access? <App actor = {actor} identity = {identity} />: <Disclaimer id = {user.toText()}/> }  */}
    <App actor = {actor} identity = {identity} /> 
  </React.StrictMode>,
  );
}

init();
