import { useAppContext } from '../context/appContext'
import StatsItem from './StatsItem'
import { MdPendingActions } from 'react-icons/md'
import { SiGooglecalendar } from 'react-icons/si'
import { FaTrash } from 'react-icons/fa'
import Wrapper from '../assets/wrappers/StatsContainer'

const StatsContainer = () => {
    const { stats } = useAppContext()
    const defaultStats = [
        {
            title: 'pending applications',
            count: stats.pending || 0,
            icon: <MdPendingActions />,
            color: '#e9b949',
            bcg: '#fcefc7',
        },
        {
            title: 'interviews scheduled',
            count: stats.interview || 0,
            icon: <SiGooglecalendar />,
            color: '#647acb',
            bcg: '#e0e8f9',
        },
        {
            title: 'jobs declined',
            count: stats.declined || 0,
            icon: <FaTrash />,
            color: '#d66a6a',
            bcg: '#ffeeee',
        }
    ]
  return (
      <Wrapper>
          {defaultStats.map((item, index) => {
              return <StatsItem key={index} {...item} />
          })}
      </Wrapper>
      
  )
}

export default StatsContainer