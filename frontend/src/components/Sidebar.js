import ChatIcon from "@material-ui/icons/Chat";
import SearchIcon from "@material-ui/icons/Search";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Conversation from "./Conversation";
import { IconButton } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../utils/firebase";
import { logoutStart, logoutFailed } from "../redux/authSlice";
import { useState } from "react";
import User from "./User";
import { sendLogout } from "../redux/socketActions";

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const [isUsersActive, setIsUsersActive] = useState(false);
  const [isConversationsActive, setIsConversationsActive] = useState(true);
  const conversations = useSelector(
    (state) => state.conversation.conversations
  );
  const users = useSelector((state) => state.users.users);

  const toggleUsersList = () => {
    setIsUsersActive(true);
    setIsConversationsActive(false);
  };
  const toggleConversationsList = () => {
    setIsUsersActive(false);
    setIsConversationsActive(true);
  };

  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logoutStart());
    auth
      .signOut()
      .then(() => {
        dispatch(sendLogout());
      })
      .catch((err) => {
        console.log(err);
        dispatch(logoutFailed(err));
      });
  };

  return (
    <div className="h-full w-1/3 lg:flex-0.3 flex flex-col rounded-tl-2xl rounded-bl-2xl">
      {/* ******************* Sidebar ************************/}
      <div className="flex h-16  rounded-tl-2xl items-center px-4 justify-between flex-shrink-0">
        <img
          src={user.photoURL}
          alt=""
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex gap-x-2">
          <IconButton onClick={toggleConversationsList}>
            <ChatIcon className="fill-current text-white" />
          </IconButton>
          <IconButton onClick={toggleUsersList}>
            <GroupAddIcon className="fill-current text-white" />
          </IconButton>
          <IconButton onClick={logoutHandler}>
            <ExitToAppIcon className="fill-current text-white" />
          </IconButton>
        </div>
      </div>

      {/************************** search ***************************/}
      <div className="bg-conversation w-full p-2 py-3 border-b border-white border-opacity-30">
        <div className="bg-search rounded-full h-8 flex items-center px-2 gap-x-8 text-white focus-within:text-black  ">
          <SearchIcon className="fill-current" />
          <input
            type="text"
            className="outline-none bg-transparent flex-grow border-none"
            placeholder="Search or start a new chat "
          />
        </div>
      </div>
      <div className="flex-col flex overflow-y-auto">
        {isConversationsActive &&
          conversations?.map((c) => (
            <Conversation key={c._id} conversation={c} />
          ))}
        {isConversationsActive && conversations.length === 0 && (
          <span>No Conversations</span>
        )}
        {isUsersActive && users?.map((u) => <User key={u._id} user={u} />)}
        {isUsersActive && user.length === 0 && <span>No Users</span>}
        {/* Conversations */}
        {/* <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation /> */}
      </div>
    </div>
  );
};

export default Sidebar;
