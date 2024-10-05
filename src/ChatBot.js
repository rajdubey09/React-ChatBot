import React, {useEffect, useState, useRef} from "react"
import "./ChatBot.css"
import image1 from './images/bot.jpg';

const ChatBot = () => {

    const chatboxRef = useRef(null);
    // const data = localStorage.getItem('Chatbot-data') ? localStorage.getItem('Chatbot-data') : '';
    // console.log(data);
    const messages = [];
    const [isVisible, setIsVisible] = useState(true);
    const toggleVisibility = () => {
        setIsVisible((prev) => !prev);
    };
    useEffect(() => {
        const elements = document.getElementsByClassName('chatbox__support');
        for (let i=0; i<elements.length; i++){
            elements[i].style.opacity = isVisible ? 0 : 1;
        }
    }, [isVisible]);

    // massage update start
    const onSendButton = () => {
        var textField = document.getElementsByClassName('inputValue')[0];
        let text1 = textField.value;
        if(text1 === "") {
            return;
        }
        let msg1 = {name: "User", message: text1}
        messages.push(msg1);
        // integrating python starts

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({message: text1}),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            let msg2 = {name: "Bot", message: r.answer};
            messages.push(msg2);
            updateChatText()
            textField.value = ''
        })
        .catch((error) => {
            console.error('Error:', error);
            updateChatText()
            textField.value = ''
        });
        // integrating python ends

        // let msg2 = {name: "Bot", message: 'Chatbot Responding'}
        // messages.push(msg2);
        // updateChatText();
        // textField.value = '';

    }

    function updateChatText() {
        let html ='';

        messages.slice().reverse().map((item, index) => {

            if(item.name === "Bot"){
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }            

        });

        const chatMessage = chatboxRef.current.querySelector('.chatbox__messages');
        chatMessage.innerHTML = html;

    }
    // massage update end

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSendButton();
        }
    }

    return (
        <>
        <div class="main">
            <div class="container">
                <div class="chatbox">
                    <div className="chatbox__support" ref={chatboxRef}>
                        <div class="chatbox__header">
                            <div class="chatbox__image--header">
                                <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" alt="img"></img>
                            </div>
                            <div class="chatbox__content--header">
                                <h4 class="chatbox__heading--header">Chat Support</h4>
                                <p class="chatbox__description--header">Hi! I am your Bot</p>
                            </div>
                        </div>
                        <div class="chatbox__messages">
                            <div></div>
                        </div>
                        <div class="chatbox__footer">
                            <input class="inputValue" type="text" placeholder="Type your message..." onKeyDown={handleKeyDown}></input>
                            <button class="chatbox__send--footer send__button" onClick={onSendButton}>Send</button>
                        </div>
                    </div>
                    <div class="chatbox__button">
                        <button onClick={toggleVisibility}><img src={image1} alt="img"/></button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )

}

export default ChatBot