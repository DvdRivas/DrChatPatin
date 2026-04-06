from sentence_transformers import SentenceTransformer

# ========================================================================================
print("Loading model..")
model = SentenceTransformer("Qwen/Qwen3-Embedding-4B", device='cpu')
print("Model loaded and ready to use")

# ========================================================================================

EMBEDDING_DIM = model.get_sentence_embedding_dimension()
MAX_SEQ_LENGTH_IN_TOKENS = model.get_max_seq_length()

print(f"Embedding dimensions: {EMBEDDING_DIM}")

# ========================================================================================
# IMPORTS 

from pymilvus import MilvusClient
from dotenv import load_dotenv
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend

load_dotenv()

# --- Configuration ---
# IMPORTANT! This key must be EXACTLY the same as the one used in the frontend.
# It must be 32 bytes to be compatible with AES-256.
ENCRYPTION_KEY = PUT_ENCRYPTION_KEY_HERE
backend = default_backend()

def encrypt_data(text: str) -> dict:
    """
    Encrypts plain text using AES-CBC.
    Generates a new IV for each operation.

    Args:
        text: The plain text string to encrypt.

    Returns:
        A dictionary with 'iv' and 'encripted' as hexadecimal strings.
    """
    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(text.encode('utf-8')) + padder.finalize()

    iv = os.urandom(16)

    cipher = Cipher(algorithms.AES(ENCRYPTION_KEY), modes.CBC(iv), backend=backend)
    encryptor = cipher.encryptor()
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()

    return {
        "iv": iv.hex(),
        "encripted": encrypted_data.hex()
    }

def decrypt_data(encrypted_data: dict) -> str:
    """
    Decrypts data that was encrypted with AES-CBC.

    Args:
        encrypted_data: A dictionary with 'iv' and 'encripted' in hexadecimal format.

    Returns:
        The original plain text string.
    """
    iv = bytes.fromhex(encrypted_data['iv'])
    encrypted_text = bytes.fromhex(encrypted_data['encripted'])

    cipher = Cipher(algorithms.AES(ENCRYPTION_KEY), modes.CBC(iv), backend=backend)
    decryptor = cipher.decryptor()
    decrypted_padded_data = decryptor.update(encrypted_text) + decryptor.finalize()

    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    decrypted_data = unpadder.update(decrypted_padded_data) + unpadder.finalize()

    return decrypted_data.decode('utf-8')

# ========================================================================================

from fastapi import FastAPI, HTTPException, Request
import torch
import torch.nn.functional as F
import numpy as np
from openai import AsyncOpenAI 
from fastapi.middleware.cors import CORSMiddleware
import datetime
import os

POE_KEY = POE_API_KEY_HERE
client_openai = AsyncOpenAI(api_key=POE_KEY, base_url="https://api.poe.com/v1")


async def UseAPI(query: str, ins: str) -> str:
    """
    Sends a message to the OpenAI model asynchronously.
    Combines instructions (ins) and query.
    """
    messages = [
        {"role": "system", "content": ins},
        {"role": "user", "content": query},
    ]

    completion = await client_openai.chat.completions.create(
        model="DrChatPatin-20B",  
        messages=messages,
        timeout=60,  # 
    )

    return completion.choices[0].message.content


app = FastAPI(
    title = 'DrChatPatin API Service',
    description='LLM professionals assistant in the preliminary diagnosis of common and rare diseases',
    version='1.0.0',
    
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://zu6ru-giaaa-aaaad-qhqba-cai.icp0.io"],       
    allow_credentials=True,
    allow_methods=["*"],           
    allow_headers=["*"],           
)

@app.post('/differential_diagnosis', tags=['Differential Diagnosis'])
async def differential_diagnosis(req: Request):
    """
    First differential diagnosis.
    """
    data = await req.json()
    query = decrypt_data(data)

    ins = ""
    ans = await UseAPI(query, ins)
    return encrypt_data(ans)


@app.post('/differential_diagnosis_2t', tags=['Differential Diagnosis'])
async def differential_diagnosis_2t(req: Request):
    """
    Second diagnosis (additional reflection).
    """
    data = await req.json()
    query = decrypt_data(data)

    ans = await UseAPI(query, "")

    ins = (
        "Process the following information about a diagnosis. "
        "Analyze the data again. Do a second thought considering the most relevant information, "
        "and then, provide a differential diagnosis:"
    )
    ans2 = await UseAPI(ans, ins)

    return encrypt_data(ans2)


@app.post('/use_rag', tags=['RAG'])
async def generate_response_rag(req: Request):
    """
    Generates a response using RAG:
    - Summarizes the conversation
    - Retrieves related fragments
    - Produces an informed response
    """
    data = await req.json()
    query = decrypt_data(data)

    query_embeddings = torch.tensor(model.encode([query]))
    query_embeddings = F.normalize(query_embeddings, p=2, dim=1)
    query_embeddings = list(map(np.float32, query_embeddings))
    OUTPUT_FIELDS = ['chunk', 'source']
    c_name = "RareDisease"

    client = MilvusClient("NRD.db") 
    client.load_collection(c_name)

    results = client.search(
        c_name,
        data=query_embeddings,
        output_fields=OUTPUT_FIELDS,
        limit=10,
        consistency_level="Eventually",
    )
    client.close()
    cites_set = set()
    for result in results[0]:
        source = result['entity']['source']
        clean_source = source.replace("NORD_DB/", "").replace(".txt", "")
        cites_set.add(clean_source)

    ins = f"""
    [CONVERSATION CONTEXT]
    {query}

    [ADDITIONAL INFORMATION (RAG – optional)]
    The following knowledge fragments were retrieved.
    Use them only if they enrich or validate your response:
    {results}

    [TASK INSTRUCTION]
    Respond to the user’s question based on the information given.
    Respond naturally. Always respond in the language of the conversation.
    """

    ans = await UseAPI(ins, "")

    cites_html = "".join(
        f'<span title="{disease}" style="cursor: help;">[{i}]</span>'
        for i, disease in enumerate(cites_set, 1)
    )
    cites_container_html = f'<div class="cites-container">{cites_html}</div>'

    response = f"""{ans}
    <br>
    <strong>📖 Diseases cited:</strong>
    {cites_container_html}
    """
    
    return encrypt_data(response)


@app.post('/save_data', tags=['Storage'])
async def save_data(req: Request):
    """
    Locally saves the decrypted conversation.
    """
    data = await req.json()
    iv = data.get("iv")
    encrypted = data.get("encripted")

    data_decrypted = decrypt_data({"iv": iv, "encripted": encrypted})
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    file_name = f"Conversations/{timestamp}.txt"

    os.makedirs("Conversations", exist_ok=True)
    with open(file_name, "w", encoding="utf-8") as f:
        f.write(data_decrypted)

    return {"status": "ok"}

# ========================================================================================
