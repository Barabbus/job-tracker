import { useAppContext } from '../context/appContext'
import { useEffect } from 'react'
import Loading from './Loading'
import Job from './Job'
import PageBtnContainer from './PageBtnContainer'
import Wrapper from '../assets/wrappers/JobsContainer'

const JobsContainer = () => {
    const { getJobs, jobs, isLoading, page, totalJobs, search, searchStatus, searchType, sort, numOfPages} = useAppContext()

    useEffect(() => {
        // Executes getJobs function whenever this component mounts
        getJobs()        
        // V Imp - A change in state of any of the following context variables will trigger getJobs function
        // eslint-disable-next-line
    }, [page, search, searchStatus, searchType, sort]) // dependency array
    
    if (isLoading) {
        return <Loading center />
    }

    if (jobs.length === 0) {
        return (
            <Wrapper>
                <h2>No jobs to display...</h2>
            </Wrapper>
        )
    }

  return (
    <Wrapper>
          <h5>                
              {totalJobs} job{ totalJobs > 1 && 's'} found
          </h5>
          <div className="jobs">
              {jobs.map((job) => {
                  return <Job key={job._id}{...job} />
              })}
          </div>
          {/* pagination buttons */}
          {numOfPages > 1 && <PageBtnContainer />}          
    </Wrapper>
  )
}

export default JobsContainer