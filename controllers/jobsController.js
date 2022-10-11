import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import mongoose from 'mongoose'
import moment from 'moment'

const createJob = async (req, res) => {
    const { position, company } = req.body

    if (!position || !company) {
        throw new BadRequestError("Please provide all values")
    }

    // Note: userId is coming from authenticateUser on jobs route
    req.body.createdBy = req.user.userId

    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params

    const job = await Job.findOne({ _id: jobId })

    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    /* Check permissions to ensure that user is authorised to delete job */
    checkPermissions(req.user, job.createdBy)

    await job.remove()

    res.status(StatusCodes.OK).json({ msg: "Success! Job removed" })    
}

const getAllJobs = async (req, res) => {
    // Get the following data from the query string parameter
    const { search, status, jobType, sort } = req.query

    const queryObject = {
        createdBy: req.user.userId
    }

    // Get back all jobs where the status is not equal to 'all' 
    if (status !== "all") {
        queryObject.status = status
    }

    // Get back all jobs where the jobType is not equal to 'all'
    if (jobType !== "all") {
        queryObject.jobType = jobType
    }

    // If search field contains data perform regex search which is case-insensitive
    if (search) {
        queryObject.position = { $regex: search, $options: "i" }
    }

    /* Note: Don't use await here. Need to chain other methods to result. Using await immediately brings back the result. By not using await, we get back a query which allows us to chain other methods to it. */ 
    let result = Job.find(queryObject)

    // Sort
    // Sort jobs in descending order with most recent first dependent on creation date 
    if (sort === "latest") {
        result = result.sort("-createdAt")
    }
    // Sort jobs in ascending order with oldest first dependent on creation date 
    if (sort === "oldest") {
        result = result.sort("createdAt")
    }
     // Sort jobs in alphabetical order
    if (sort === "a-z") {
        result = result.sort("position")
    }
    // Sort jobs in reverse alphabetical order
    if (sort === "z-a") {
        result = result.sort("-position")
    }

    // Pagination
    // Limit the number of jobs displayed per page 
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    // Determine the number of jobs to skip before displaying the next 10 on a page
    const skip = (page - 1) * limit
    result = result.skip(skip).limit(limit)    

    // Now we can use await here to get back our result as we no longer need to chain any more methods to our query
    const jobs = await result

    // Check the number of jobs returned by the queryObject
    const totalJobs = await Job.countDocuments(queryObject)
    // Calculate number of pages to display
    const numOfPages = Math.ceil(totalJobs/limit)

    res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
}

const updateJob = async (req, res) => {
    const { id: jobId } = req.params

    const { company, position } = req.body

    if (!company || !position) {
        throw new BadRequestError("Please provide all values")
    }

    const job = await Job.findOne({ _id: jobId })

    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }    

    /* Check permissions to ensure that user is authorised to make changes to the job */
    checkPermissions(req.user, job.createdBy)    

    /* Note: remember that using findOneAndUpdate will not trigger any mongoose middleware.  Need to use save() if that is the case.  Here, there is no middleware in the job model so using findOneAndUpdate is ok */  
    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
        new: true,
        runValidators: true
    })

    res.status(StatusCodes.OK).json({ updatedJob })
}

// Show the grouping of jobs by status
const showStats = async (req, res) => {
    // Get all the jobs for a particular user and group them based on their status
    let stats = await Job.aggregate([
        // userId will be a string so need to convert back to ObjectId in Mongoose model 
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        // group by status  
        { $group: { _id: "$status", count: { $sum: 1 }}}  // Returns an array of objects, one for each group
    ])
    // Return an object that contains each status group and the number of items in that group 
    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr
        acc[title] = count
        return acc
    }, {})

    // Set default values if we have no stats
    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0
    }


    // Group jobs based on the year and month they were added to the tracker
    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        {
            // Group based on year and month job was added
            $group: {
                _id: {
                    year: {
                        $year: '$createdAt',
                    },
                    month: {
                        $month: '$createdAt',
                    }
                },
                // Count is keeping track of those jobs that were created in a particular month for a particular year
                count: { $sum: 1 }
            },
        },
        // Sort jobs by latest year and month to get jobs added in the past year 
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
    ])
    monthlyApplications = monthlyApplications
        .map((item) => {
            // Deconstruct item
            const {
                _id: { year, month },
                count,
            } = item
            const date = moment()
                .month(month - 1)
                .year(year)
                .format('MMM Y')
            return { date, count }
        })
        // Reverse the contents of the array so that the oldest job is first in the array
    .reverse()
    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats }