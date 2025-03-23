import react,{useState,useEffect} from 'react'
import { useTheme } from './utils/useTheme'
import { MdDarkMode } from "react-icons/md";
import Cookies from 'js-cookie';
import AuthButtons from './component/AuthButtons';
import { PiStudent } from "react-icons/pi";
import './App.css'

function App() {
  
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token'); 
    if(token){
      setIsLoggedIn(true);
    }
  },[])

  return (
    <>
      <div className="container-fluid">
        <div className="row ">
          <div className="col-12">
            <div className="header d-flex align-items-center justify-content-between">

              <div className="d-flex gap-2 align-items-center">
              <PiStudent size={50}  className="pi-student-icon"/>
                <div className="e-learn-text">E-learn Platform</div>
              </div>
             <div className='d-flex gap-5 align-items-center'>
                  {!isLoggedIn && <AuthButtons />}
                    <button onClick={toggleTheme} className="theme-button">
                      <MdDarkMode size={25} />
                    </button>
             </div>
            </div>
          </div>
        </div>
      </div>
      </>
  )
}

export default App
