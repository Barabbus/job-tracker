import moment from 'moment'
import { ImBriefcase } from 'react-icons/im'
import { MdLocationPin } from 'react-icons/md'
import { BsFillCalendarDateFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Job'
import JobInfo from './JobInfo'

const Job = ({
  _id: id,
  position, 
  company,
  jobLocation,
  jobType,
  createdAt,
  status
}) => {

  const { setEditJob, deleteJob } = useAppContext()

  let date = moment(createdAt)
  date = date.format("Do MMM YYYY")
  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<MdLocationPin />} text={jobLocation} />
          <JobInfo icon={<BsFillCalendarDateFill />} text={date} />
          <JobInfo icon={<ImBriefcase />} text={jobType} />
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className="actions">
            <Link
              to="/add-job"
              onClick={() => setEditJob(id)}
              className="btn edit-btn"
            >
              Edit            
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => deleteJob(id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>  
  )
}

export default Job