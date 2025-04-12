import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api  from '../utils/HttpMiddleware';
import { useToast } from '../contexts/ToastContext';
import {isSuccess,parseMessage,parseData,parseResponseType}  from '../utils/HttpResponseParser';
import {LoginResponseDto} from '../types/account/LoginResponseDto';
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from 'jwt-decode';
import styles from '../styles/LoginStyle';

const HomeScreenPage: React.FC = () => {
   const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [error, setError] = useState("");
      const [isLoading, setIsLoading] = useState(false);
  
      const { showToast } = useToast();
      const navigate = useNavigate();
      const { setAuthState } = useAuth();

      const requestRegistration = () => {
        navigate('/register');
      };
  
      const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
    
        try {
          const response = await api.post('/account/login', {
            username,
            password,
          });
          
  
          if(isSuccess(response)){
           let obj= parseData<LoginResponseDto>(response);
          
           localStorage.setItem('access_token', obj.Token);
           localStorage.setItem('refresh_token', obj.RefreshToken);
           try {
            const decodedToken: any = jwtDecode(obj.Token);
            setAuthState(true, decodedToken.role); 
          } catch (error) {
            console.error("Error decoding token:", error);
            setAuthState(false, null); // Handle error if decoding fails
          }
           navigate('/');
          }
          else{
            showToast(parseMessage(response),parseResponseType(response),{
              autoClose: 3000,  
              draggable: true
            });
          }
    
        } catch (err) {
          // Handle error response
          setError('Invalid username or password.');
          console.error('Login error:', err);
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <div style={styles.mainContainer}>
      {/* Left Section */}
      <div style={styles.leftSection}>
        <div>
          <h1 style={styles.heading}>Client Feedback Portal</h1>
          <p style={styles.description}>
            Track your feedback, stay updated on changes, and communicate directly with the development team. We value your input!
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>
        <h2 style={styles.subHeading}>Login to Your Account</h2>
        <form id="login-form" onSubmit={handleLogin} style={styles.form}>
          <input type="email" placeholder="Email" required style={styles.input} value={username}
                              onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="Password" required style={styles.input} value={password}
                              onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" style={styles.button}>Login</button>
        </form>

        <a href="#" onClick={requestRegistration} style={styles.forgotPassword}>
          Request Registration
        </a>
      </div>
    </div>
  );
};

export default HomeScreenPage;

