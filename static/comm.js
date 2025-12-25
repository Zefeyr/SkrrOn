// comm.js

import { db, auth } from './firebase-init.js';
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    limit, 
    onSnapshot, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const messageContainer = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

// 1. LISTEN FOR LIVE MESSAGES
const messagesCol = collection(db, "messages");
const q = query(messagesCol, orderBy("createdAt", "asc"), limit(50));

onSnapshot(q, (snapshot) => {
    messageContainer.innerHTML = ''; 
    
    snapshot.forEach((doc) => {
        const data = doc.data();
        renderMessage(data);
    });
    
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

// 2. SEND A NEW MESSAGE
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    const text = chatInput.value.trim();

    if (text === "" || !user) return;

    try {
        await addDoc(messagesCol, {
            text: text,
            uid: user.uid,
            // Automatically uses the username saved during signup
            displayName: user.displayName || "Gamer", 
            photoURL: user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
            createdAt: serverTimestamp()
        });
        chatInput.value = ''; 
    } catch (error) {
        console.error("Error sending message: ", error);
    }
});

// 3. RENDER FUNCTION
function renderMessage(data) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    
    const isMe = auth.currentUser && data.uid === auth.currentUser.uid;
    if (isMe) msgDiv.classList.add('my-message');

    msgDiv.innerHTML = `
        <img src="${data.photoURL}" alt="avatar" class="avatar">
        <div class="message-content">
            <div class="message-info">
                <span class="username">${data.displayName}</span>
                <span class="timestamp">${data.createdAt?.toDate().toLocaleTimeString() || 'Just now'}</span>
            </div>
            <p class="text">${data.text}</p>
        </div>
    `;
    messageContainer.appendChild(msgDiv);
}