import React, { useState } from "react";
import {registerUser} from "../features/auth/auth.thunk.js"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handelOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validation = () => {
    const errors = {};
    if(!formData.name) errors.name = "Name is required"
    if(!formData.email) errors.email = "Email is required"
    if(!formData.password) errors.password = "Password is required"
    if(!formData.confirmPassword) errors.confirmPassword = "Confirm Password is required"

    if(formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match"

    setErrors(errors)
    return errors
  }

  const handelOnSubmit = async (e) => {
    e.preventDefault();
    const errors = validation()
    if(Object.keys(errors).length === 0){
     const result = await dispatch(registerUser(formData)).unwrap();
     if(result){
      navigate("/dashboard");
     }
    }
  };



  return (
    <div>
      <div>
        <form onSubmit={handelOnSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handelOnChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handelOnChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handelOnChange}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handelOnChange}
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
