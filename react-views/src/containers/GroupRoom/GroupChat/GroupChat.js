import React from 'react'
import styles from './GroupChat.module.scss'
import ChatMessage from './ChatMessage/ChatMessage'
import ChatInput from './ChatInput/ChatInput'

const GroupChat = (props) => (
    <section className={styles.GroupChatContainer}>
        <ChatInput
        click={props.sendMessageHandler}
        userInput={props.userInput}
        changeInputHandler={props.changeInputHandler}
        progressSpinner={props.progressSpinner}
        />
        {props.messages.map(m => {
            return <ChatMessage
            key={m._id}
            message={m}
            deletePost={props.deletePost}
            />
        })}
    </section>
);

export default GroupChat;