import React from "react";
import { BiLogIn } from "react-icons/bi";
import { GoSignIn } from "react-icons/go";

const AuthButtons = () => {
  return (
    <div className="d-flex gap-4">
      <button className="btn btn-primary px-5 d-flex align-items-center gap-2"><BiLogIn  size={25}/>   Login  </button>
      <button className="btn btn-info px-5 flex align-items-center gap-2"><GoSignIn size={25}/>Register</button>
    </div>
  );
};

export default AuthButtons;
