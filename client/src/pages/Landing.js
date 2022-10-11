import main from '../assets/images/main-recruit.jpg'
import Wrapper from '../assets/wrappers/LandingPage'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <Wrapper>      
      <div className="container page">
        <div className="info">
          <h1>job <span>tracking</span> app</h1>          
          <h5>Job Tracker is a responsive web app that allows users to keep track of their job applications.</h5>          
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img src={main} alt="job search" className="img main-img" />
      </div>      
    </Wrapper>
  )
}

export default Landing