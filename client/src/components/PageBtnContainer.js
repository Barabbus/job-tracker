import { useAppContext } from '../context/appContext'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageBtnContainer = () => {
    const { numOfPages, page, changePage } = useAppContext()

    // Create an array based on numOfPages and increment each element in the array by 1 based on the index value
    const pages = Array.from({ length: numOfPages }, (_, index) => {
        return index + 1
    })
    
    // console.log(pages)

    // Wraparound in pagination
    const prevPage = () => {
        let newPage = page - 1
        if (newPage < 1) {
            newPage = numOfPages            
        }
        changePage(newPage)
    }

    const nextPage = () => {
        let newPage = page + 1
        if (newPage > numOfPages) {
            newPage = 1            
        }
        changePage(newPage)
    }
  return (
      <Wrapper>
          <button className='prev-btn' onClick={prevPage}>
              <HiChevronDoubleLeft />
              prev
          </button>
          <div className='btn-container'>
              {/* Create a button for each page of jobs to display */}
              {pages.map((pageNumber) => {
                  return (
                      <button
                          type="button"
                          // Highlight the active button
                          className={pageNumber === page ? "pageBtn active" : "pageBtn"}
                          key={pageNumber}
                          onClick={() => changePage(pageNumber)}
                      >
                          {pageNumber}
                      </button>
                  )
              })}
          </div>
          <button className='next-btn' onClick={nextPage}>
              next
              <HiChevronDoubleRight />
          </button>
      </Wrapper>
  )
}

export default PageBtnContainer