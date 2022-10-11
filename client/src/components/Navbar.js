import Wrapper from '../assets/wrappers/Navbar'
import { FaUserTie } from 'react-icons/fa'
import { IoCaretDownCircleSharp } from 'react-icons/io5'
import { ImMenu } from 'react-icons/im'
import { useAppContext } from '../context/appContext'
import Logo from './Logo'
import { useState } from 'react'

const Navbar = () => {
    const [showLogout, setShowLogout] = useState(false)
    const { toggleSidebar, user, logoutUser } = useAppContext()
  return (
    <Wrapper>
        <div className="nav-center">
            <button className="toggle-btn" onClick={toggleSidebar}>
                  <ImMenu />
              </button>
              
            <div>
                <Logo />
                <h3 className="logo-text">dashboard</h3>
            </div>
            
            <div className="btn-container">
                <button
                    className="btn"
                    onClick={() => setShowLogout(!showLogout)}
                >
                    <FaUserTie />
                        {user?.name}
                      <IoCaretDownCircleSharp />
                </button>
                <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
                    <button
                        type="button"  
                        className="dropdown-btn"
                        onClick={logoutUser}
                    >                    
                        logout
                    </button>
                </div>
            </div>
        </div>
    </Wrapper>
  )
}

export default Navbar