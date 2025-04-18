import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import VerticalSeparator from '../components/VerticalSeparator';
import { PiUserCircleFill } from 'react-icons/pi';
import { MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  // Temporary Only
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({userName: username, password: password}),
        headers: {'Content-Type': 'application/json'},
        credentials: "include",
      })
      const data = await res.json()
      if(data.errors){
        setErrors(data.errors)
      }else if(data.userType == "Super User" || data.userType == "User"){
        navigate("/home")
      }else if(data.userType == "Admin"){
        navigate("/admin")
      }else{
        navigate("/")
      }
    }catch(err){
      console.log(err)
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    (async function () {
      try {
        const res = await fetch("http://localhost:4000/api/auth/user", {
          method: 'GET',
          credentials: "include"
        });
        const user = await res.json();
        if(user.userType == "Super User" || user.userType == "User"){
          navigate("/home")
        }else if(user.userType == "Admin"){
          navigate("/admin")
        }else{
          navigate("/")
        }
      } catch (error) {
        navigate("/")
      }
    }())
  }, []);
  return (
    <div className='bg-aqua-wave h-screen w-screen flex justify-center items-center'>
      <div>
        <div className='text-7xl font-bold text-center text-placebo-turquoise drop-shadow-title'>
          <h1>Login</h1>
        </div>
        <br/>
        <br/>
        <br/>
        <div className='my-6'></div>
        <form className='flex flex-col items-center max-w-md mx-auto' onSubmit={handleSubmit}>
          <div className='flex items-center border bg-blizzard border-enamelled-jewel p-2 rounded-10px w-full h-14 transition ease-in duration-200 hover:shadow-custom'>
            <PiUserCircleFill className='text-enamelled-jewel text-4xl' />
            <VerticalSeparator />
            <div className='w-full'>
              <input
                className={`bg-blizzard w-full text-xl focus:outline-none ${username ? 'text-black' : 'text-black-mana'}`}
                placeholder='Username'
                type='text'
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
          </div>
          <br/>
          <div className='flex items-center border bg-blizzard border-enamelled-jewel p-2 rounded-10px w-full h-14 transition ease-in duration-200 hover:shadow-custom'>
            <MdLock className='text-enamelled-jewel text-4xl' />
            <VerticalSeparator />
            <div className='w-full flex'>
              <input
                className={`bg-blizzard w-full text-xl focus:outline-none ${password ? 'text-black' : 'text-black-mana'}`}
                placeholder='Password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
              />
              {showPassword ? (
                <MdVisibility
                  className='text-enamelled-jewel cursor-pointer mt-1 ml-2 text-xl'
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <MdVisibilityOff
                  className='text-black-mana cursor-pointer mt-1 ml-2 text-xl'
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>
          <div className='my-2 text-enamelled-jewel underline'>
              {
                errors ? (<div>{errors.message}</div>) : (<></>)
              }
          </div>
          <div className='my-6'></div>
          <button className='bg-placebo-turquoise text-2xl font-semibold border w-40 h-14 border-enamelled-jewel text-enamelled-jewel transition ease-in duration-200 hover:shadow-custom' type='submit' onClick={(e)=>handleSubmit(e)}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;