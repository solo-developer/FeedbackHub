import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./../styles/Login.module.css";
import { post } from '../utils/HttpMiddleware';
import { useToast } from '../contexts/ToastContext';
import {isSuccess,parseMessage,parseData,parseResponseType}  from '../utils/HttpResponseParser';
import {LoginResponseDto} from '../types/account/LoginResponseDto';
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useToast();
    const navigate = useNavigate();
    const { setAuthState } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
  
      try {
        const response = await post('/account/login', {
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
      <div className={styles.loginCard} style={{ marginTop: '20%' }}>

          <div className="d-flex justify-content-center">
              <div className="card shadow-sm p-4 w-100">
                  <h2 className="">Login</h2>
                  {error && <p className="text-danger">{error}</p>}
                  <form onSubmit={handleLogin}>
                      <div className="form-group">
                          <label className="text-start w-100">Username</label>
                          <input
                              type="text"
                              placeholder="Username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="form-control"
                          />
                      </div>

                      <div className="form-group mb-2">
                          <label className="text-start w-100">Password</label>
                          <input
                              type="password"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="form-control"
                          />
                      </div>

                      <button
                          type="submit"
                          className="form-control login-btn btn-primary"
                      >
                          Login
                      </button>
                  </form>
              </div>
          </div>
      </div>

  );

};


export default LoginPage;