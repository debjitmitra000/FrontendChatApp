import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useAsyncMutation } from "../../hooks/hook";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
import UserItem from "../Shared/UserItem";
import "../styles/scrolls.css";


function Search({ onSearchClose }) {

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest,isloadingSendRequest] = useAsyncMutation(useSendFriendRequestMutation)


  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e) => setSearchValue(e.target.value);

  const handleClearSearch = () => {
    setSearchValue("");
    setFilteredUsers([]);
    if (onSearchClose) {
      onSearchClose();
    }
  };

  const addFriendHandler = async(id) => {
    await sendFriendRequest("Sending friend request...",{userId: id})
  };

  useEffect(() => {
    const timeOutId = setTimeout(()=>{
      if (searchValue.trim()) {
        searchUser(searchValue)
        .then(({data})=>setFilteredUsers(data.users))
        .catch((e)=> console.log(e))
      } else {
        setFilteredUsers([]);
      }
    },500)
    return()=>{
      clearTimeout(timeOutId)
    }
  }, [searchValue]);

  return (
    <div className="flex flex-col items-center gap-4 mt-6 relative">
      {/* Search Input */}
      <div className="relative w-full max-w-[360px] h-[40px] rounded-full overflow-hidden z-10">
        <div
          className={`absolute inset-0 border-2 rounded-full transition-opacity duration-500 ${
            isFocused ? "opacity-0" : "opacity-100"
          } border-white`}
        ></div>
        <div
          className={`absolute left-7 right-7 bottom-0 h-0.5 ${
            isFocused ? "bg-white" : "bg-transparent"
          } transition-colors duration-500 ease-in-out`}
        ></div>
        <div
          className={`absolute left-0 top-0 h-full w-[60px] flex items-center justify-center text-white transition-transform duration-500 ease-in-out ${
            isFocused ? "transform rotate-0" : "transform -rotate-45"
          }`}
        >
          <FaSearch size={20} />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search"
          className="relative w-full h-full pl-[60px] pr-[60px] bg-transparent text-white text-sm outline-none placeholder-white"
        />
        {searchValue && (
          <div
            className="absolute right-0 top-0 h-full w-[60px] flex items-center justify-center text-white cursor-pointer z-20"
            onClick={handleClearSearch}
          >
            <FaTimes size={20} />
          </div>
        )}
      </div>

      {/* Search Results */}
      {filteredUsers.length > 0 && (
        <div className="absolute w-full max-w-[360px] top-[60px] bg-[#694ac7] text-white rounded-lg shadow-lg z-30">
          <div className="max-h-[200px] overflow-y-scroll search-scrollbar">
            <ul>
              {filteredUsers.map((user) => (
                <UserItem
                  key={user._id}
                  user={user}
                  handler={() => addFriendHandler(user._id)}
                  handlerIsLoading={isloadingSendRequest}
                  isAdded={false}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
