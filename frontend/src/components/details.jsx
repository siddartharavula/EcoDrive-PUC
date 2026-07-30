import React from 'react'

const details = (props) => {
  return (
        <div 
        className="h-50 w-80 flex flex-col flex-wrap gap-3 bg-black border border-white rounded-3xl hover:border-green-500 
        text-white font-medium px-10 py-5 justify-center">
            
            <h4>Vachile No : {props.VachileNumber}</h4>
            <h4>Vahicle Type : {props.VahicleType}</h4>
            <h4>Expired Date : {props.VahicleExDate}</h4>
            <div className=" flex justify-center items-center">
                <button 
                className='border border-white h-10 w-30 rounded-3xl mt-1 justify-center bg-gray-700 text-white 
                hover:border-green-500'>
                    Caught
                </button>
            </div>
        </div>
  )
}

export default details
