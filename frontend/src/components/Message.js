import CheckIcon from "@material-ui/icons/Check";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import TimeAgo from "react-timeago";
import { useRef } from "react";

const Message = ({ message, own, currentConversation }) => {
  let status = message.status;
  if (currentConversation.users.length - 1 === message.deliveredTo?.length)
    status = "delivered";
  if (currentConversation.users.length - 1 === message.readBy?.length)
    status = "read";
  const statusIcon = () => {
    const className = "h-3 w-3";
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
  let scrollDiv = useRef();
  scrollDiv.current?.scrollIntoView({ behavior: "smooth" });
  return (
    <div
      className={`text-white rounded-2xl  p-2 flex flex-col mb-4 max-w-message w-max ${
        own ? "self-end" : ""
      } ${own ? "bg-chat" : "bg-header"} `}
      ref={scrollDiv}
    >
      <span className="">{message.content}</span>
      <div className="text-sm self-end items-start gap-x-1 flex">
        <span className="text-xxs mt-0.5">
          <TimeAgo className="" date={message.createdAt} />
        </span>
        {own && <span>{statusIcon()}</span>}
      </div>
    </div>
  );
};

export default Message;
