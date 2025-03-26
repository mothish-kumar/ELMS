import { MdDarkMode } from "react-icons/md";
import AuthButtons from './AuthButtons';
import { PiStudent } from "react-icons/pi";

function Header({ isLoggedIn, setIsLoggedIn,toggleTheme }) {
    return (
      <div className="container mt-2 " style={{position:'fixed',top:0,zIndex:1000,left:'20%',width:'100%'}}>
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 align-items-center">
                <PiStudent size={50} className="pi-student-icon" />
                <div className="e-learn-text">E-learn Platform</div>
              </div>
              <div className="d-flex gap-5 align-items-center">
                {!isLoggedIn ?(<AuthButtons setIsLoggedIn={setIsLoggedIn} />) :( <button onClick={() => {setIsLoggedIn(false)
                  localStorage.removeItem("token");
                  localStorage.removeItem("useName")
                  window.location.href = "/";
                }} className="btn btn-danger px-5">Logout</button>)}
                <button onClick={toggleTheme} className="theme-button">
                  <MdDarkMode size={25} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default Header