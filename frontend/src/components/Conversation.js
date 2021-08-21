import { useDispatch } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import { setCurrentConversation } from "../redux/conversationSlice";
import TimeAgo from "react-timeago";
import { useSelector } from "react-redux";
import { sendGetAllMessages } from "../redux/socketActions";

const Conversation = ({ conversation }) => {
  const dispatch = useDispatch();
  // * set the current conversation as the this conversation
  const selectConversation = () => {
    dispatch(setCurrentConversation(conversation._id));
    dispatch(sendGetAllMessages(conversation._id));
  };

  //* select the user from users
  //* this will ensure to update the user details on update
  const users = useSelector((state) => state.users.users);
  const conversationUser = users.find(
    (u) => u._id === conversation?.recipientId
  );

  // * shows the last message delivery status
  // * shows only for the loggedIn user messages
  let status = conversation.lastMessage?.status;
  if (
    conversation.users.length - 1 ===
    conversation.lastMessage?.deliveredTo?.length
  )
    status = "delivered";
  if (
    conversation.users.length - 1 ===
    conversation.lastMessage?.readBy?.length
  )
    status = "read";
  const statusIcon = () => {
    const className = "h-3 w-3 mr-1";
    switch (status) {
      case "pending":
        return <QueryBuilderIcon className={className} />;
      case "sent":
        return <CheckIcon className={className} />;
      case "delivered":
        return <DoneAllIcon className={className} />;
      case "read":
        return (
          <DoneAllIcon className={`${className} text-blue fill-current`} />
        );
      default:
        return;
    }
  };

  if (!conversation.lastMessage) return <></>;
  return (
    <div
      className="flex items-center py-2 bg-conversation text-white gap-x-2 cursor-pointer  hover:bg-header"
      onClick={selectConversation}
    >
      <img
        src={conversationUser.photoURL}
        alt=""
        className="w-16 h-16 object-cover rounded-full"
      />
      <div className="flex min-w-0 border-opacity-30 border-b flex-grow border-white h-16 items-start justify-between pr-2">
        <div className="flex max-w-conversation flex-grow flex-col min-w-0">
          <span className="">{conversationUser.displayName}</span>
          <span className="truncate w-full text-xs">
            {conversation.lastMessage?.senderId !== conversation?.recipientId &&
              statusIcon()}
            {conversation.lastMessage?.content}
          </span>
        </div>
        <div className="flex flex-col flex-shrink-0 gap-y-2 pt-1 items-center">
          {conversation.lastMessage?.createdAt && (
            <TimeAgo
              date={conversation.lastMessage?.createdAt}
              className="text-xs"
            />
          )}

          <span
            className={`bg-chat rounded-full text-xs text-black w-3 h-3 flex items-center justify-center font-semibold ${
              (conversation.lastMessage?.senderId ===
                conversation?.recipientId && status !== "read") > 0
                ? "visible"
                : "hidden"
            }`}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
