import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SendIcon from "@material-ui/icons/Send";
import Message from "./Message";
import { useSelector, useDispatch } from "react-redux";
import TimeAgo from "react-timeago";
import { IconButton } from "@material-ui/core";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { addMessage } from "../redux/messagesSlice";
import { updateLastMessage } from "../redux/conversationSlice";
import { sendNewMessage } from "../redux/socketActions";

const Main = () => {
  const currentConversation = useSelector(
    (state) => state.conversation.currentConversation
  );
  const users = useSelector((state) => state.users.users);
  const conversationUser = users.find(
    (u) => u._id === currentConversation?.recipientId
  );
  const status =
    conversationUser?.status === "online"
      ? "online"
      : `Last seen : <TimeAgo date ={${new Date(
          conversationUser?.updatedAt
        )} />}`;

  const loggedInUser = useSelector((state) => state.auth.user);
  const messages = useSelector((state) => state.messages.messages);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const enteredText = inputRef.current.value.trim();
    if (enteredText) {
      inputRef.current.value = "";
      const id = uuidv4();
      const message = {
        _id: id,
        senderId: loggedInUser._id,
        content: enteredText,
        status: "pending",
        conversationId: currentConversation._id,
        createdAt: Date.now(),
      };
      // add message
      dispatch(addMessage(message));
      // update conversation
      dispatch(updateLastMessage(message));
      dispatch(sendNewMessage(message));
    }
  };

  return (
    <div className="h-full  w-2/3 lg:flex-0.7 lg:min-w-main bg-conversation flex flex-col ">
      {currentConversation && (
        <>
          {/* ******************* Sidebar ************************/}
          <div className="flex h-16 items-center px-4 justify-between bg-header flex-shrink-0 mb-4 gap-x-2">
            <img
              src={conversationUser?.photoURL}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex flex-col text-white flex-grow">
              <span className="font-bold ">
                {conversationUser?.displayName}
              </span>
              {conversationUser?.status === "online" ? (
                <span>{status}</span>
              ) : (
                <span>
                  Last seen : {<TimeAgo date={conversationUser?.updatedAt} />}
                </span>
              )}
            </div>
            <div className="flex justify-evenly gap-x-4">
              <SearchIcon className="fill-current text-white" />
              <MoreVertIcon className="fill-current text-white" />
            </div>
          </div>

          {/* messages container */}
          <div className="flex flex-col flex-grow overflow-y-auto px-4">
            {messages.map((m) => (
              <Message
                message={m}
                key={m._id}
                own={m.senderId === loggedInUser._id}
                currentConversation={currentConversation}
              />
            ))}
          </div>
          {/* input area */}

          <form
            className="bg-header flex items-center p-4 gap-x-4"
            onSubmit={onSubmitHandler}
          >
            <IconButton>
              <InsertEmoticonIcon className="fill-current text-white" />
            </IconButton>
            <input
              className="rounded-full bg-search w-full leading-1 outline-none text-text p-2"
              placeholder="Type to send a message"
              ref={inputRef}
            />
            <IconButton type="submit">
              <SendIcon className="fill-current text-white" />
            </IconButton>
          </form>
        </>
      )}
    </div>
  );
};

export default Main;
