import { Button, Tooltip, Box, Text, Avatar, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, Toast, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { ChatState } from '../../context/chatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router';
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { Spinner } from '@chakra-ui/spinner';
const SideDrawer = () => {

  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {user,selectedChat,setSelectedChat,chats,setChats} = ChatState();
  const history=useHistory();
  const {isOpen, onOpen, onClose} = useDisclosure();

  const logoutHandler = () =>{
    localStorage.removeItem("userInfo");
    history.push("/");
  }
  const toast = useToast();
  const handleSearch= async()=>{
    if(!search){
      toast({
        title:"Please Enter Something in the search",
        status:"warning",
        duration: 5000,
        isClosable:true,
        position:"top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        },
      };
      const {data}= await axios.get(`/api/user?search=${search}`,config);
      setLoading(false);
      setSearchResult(data);
      console.log(data);
    } catch (error) {
      toast({
        title:"Failed to load results ",
        status:"error",
        duration: 5000,
        isClosable:true,
        position:"bottom-left",
      });
    }
  }

  const accessChat=async(userId)=>{
    try {
      setLoadingChat(true);
      const config={
        headers:{
          "Content-type": "application/json",
          Authorization:`Bearer ${user.token}`
        },
      };

        const {data}=await axios.post("/api/chat",{userId},config);

        if(!chats.find((c) => c._id === data._id)){
          setChats([data, ...chats]);
        }
        setSelectedChat(data);
        setLoadingChat(false);
        onClose();



    } catch (error) {
      toast({
        title:"error fetching the chat",
        status:error.message,
        duration: 5000,
        isClosable:true,
        position:"bottom-left",
      });
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} paddingLeft="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work Sans">SkyTalk</Text>
        <div>
          <Menu>
            <MenuButton padding={1}>
              <BellIcon fontSize="2xl" margin={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
            <ProfileModal user={user}> <MenuItem>My Profile</MenuItem></ProfileModal>
             
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
        <DrawerBody>
      <Box display='flex' pb={2}>
        <Input placeholder='Search by name or email'
          mr={2}
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Go</Button>
      </Box>
      {loading ? (<ChatLoading/>):(
          searchResult?.map((user) =>(
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={()=>accessChat(user._id)}
            />
          ))
      )}
      {loadingChat && <Spinner ml='auto' display='flex'/>}
    </DrawerBody>
      </DrawerContent>
    
      </Drawer>
    </>
  )
}

export default SideDrawer;
