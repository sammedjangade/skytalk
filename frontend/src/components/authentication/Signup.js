import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from "react-router";

const Signup = () => {
    const history = useHistory();
     const toast = useToast();
    const [name,setName]= useState();
    const [show,setShow]= useState(false);
    const [email,setEmail]= useState();
    const [password,setPassword]= useState();
    const [confirmpassword,setConfirmpassword]= useState();
    const [pic,setPic]= useState();
    const [loading,setLoading]= useState(false);
   

    const handleClick = () =>setShow(!show);

    const submitHandler = async ()=> {
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
            toast({
                title:"Please fill all the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            setLoading(false);
            return;
        }

        if(password !== confirmpassword){
            toast({
                title:"Passwords do not match",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            setLoading(false);
            return;
            
        } 

        try {
            const config = {
                headers:{
                    "Content-type":"application/json",
                },
            };
            const {data} = await axios.post("/api/user",{name,email,password,pic},config);

            toast({
                title:"Registration sucessful",
                status:"sucess",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });

            localStorage.setItem("userinfo",JSON.stringify(data));

            setLoading(false);
            history.push("/chats");
            
        }  catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };


    const postDetails = (pics)=> { 
        setLoading(true);
        if(pics===undefined){
            toast({
          title: 'Account created.',
          description: "Please select an image!",
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"bottom",
        });
        return;
        }
       if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "skytalk");
      data.append("cloud_name", "dfd66c6j2");
      fetch("https://api.cloudinary.com/v1_1/dfd66c6j2/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    };
    };
    


   return (
    <VStack spacing='5px' color='black'>
    <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder='Enter Your Name'
        onChange={(e)=>setName(e.target.value)}></Input>
    </FormControl>
    <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter Your Email'
        onChange={(e)=>setEmail(e.target.value)}></Input>
    </FormControl>
    <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input placeholder='Enter Your Password'
            type={show ? "text" : "password"}
        onChange={(e)=>setPassword(e.target.value)}></Input>
        <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? 'Hide' : 'Show'}
            </Button>        </InputRightElement>
        </InputGroup>
        
    </FormControl>
    <FormControl id='confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
            <Input placeholder='Enter Your Password'
            type={show ? "text" : "password"}
        onChange={(e)=>setConfirmpassword(e.target.value)}></Input>
        <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? 'Hide' : 'Show'}
            </Button>        </InputRightElement>
        </InputGroup>
        
    </FormControl>
    <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
      
    </VStack>
  )
};

export default Signup
