import { BsBarChartLineFill } from 'react-icons/bs'
import { MdQueryStats } from 'react-icons/md'
import { FaWpforms } from 'react-icons/fa'
import { CgProfile } from 'react-icons//cg'

const links = [
    { id: 1, text: 'stats', path: '/', icon: <BsBarChartLineFill /> },
    { id: 2, text: 'all jobs', path: 'all-jobs', icon: <MdQueryStats /> },
    { id: 3, text: 'add job', path: 'add-job', icon: <FaWpforms /> },
    { id: 4, text: 'profile', path: 'profile', icon: <CgProfile /> },
]

export default links