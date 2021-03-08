import React from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { addMessageMutation, messagesQuery, messageAddedSubscription } from './graphql/queries';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

const Chat = ({user}) => {
  const { data } = useQuery(messagesQuery);
  const messages = data ? data.messages : [];

  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({client, subscriptionData}) => {
      // same as writing client.cache.writeData
      client.writeData({data: {
        messages: messages.concat(subscriptionData.data.messageAdded)
      }})
    }
  });
  const [addMessage] = useMutation(addMessageMutation);

  const handleSend = async (text) => {
    const { data } = await addMessage({variables: {input: {text}}});
    console.log('mutation data: ', data);
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
};

export default Chat;
