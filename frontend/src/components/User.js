import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import IconButton from "@material-ui/core/IconButton";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentConversation } from "../redux/conversationSlice";
import { sendNewConversation } from "../redux/socketActions";

const User = ({ user }) => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const conversations = useSelector(
    (state) => state.conversation.conversations
  );
  const dispatch = useDispatch();
  const startConversation = () => {
    const selectedConversation = conversations.find(
      (c) => c.recipientId === user._id
    );
    if (selectedConversation)
      dispatch(setCurrentConversation(selectedConversation._id));
    else
      dispatch(
        sendNewConversation({
          users: [user._id, loggedInUser._id],
          conversationType: "private",
          admins: [loggedInUser._id],
        })
      );
  };
  return (
    <div className="flex items-center py-2 bg-conversation text-white gap-x-2">
      <img
        src={user.photoURL}
        alt=""
        className="w-16 h-16 object-cover rounded-full"
      />
      <div className="flex min-w-0 border-opacity-30 border-b border-white h-16 items-center justify-between flex-grow">
        <div className="flex max-w-conversation flex-col gap-y-0.5">
          <span className="font-semibold">{user.displayName}</span>
          <span className="italic text-xs">email : {user.email}</span>
          <span className="truncate w-full text-xs italic">
            status : Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Itaque pariatur quis ducimus culpa enim est harum expedita, soluta,
            eveniet cupiditate natus repudiandae totam perspiciatis reiciendis
            animi aliquam hic dolor cum.
          </span>
        </div>
        <IconButton onClick={startConversation}>
          <ChatBubbleIcon className="text-chat fill-current" />
        </IconButton>
      </div>
    </div>
  );
};

export default User;
