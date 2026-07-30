import React from 'react'
import Navbar from '../components/navbar'
import Footer from "../components/footer"
import Details from "../components/details"
const Overdue = () => {
  return (
    <div>
      <Navbar />
      <div className="flex gap-10 px-10 py-5 min-h-220">
        < Details VachileNumber="TG 26 AB 1234" VahicleType="Bike" VahicleExDate="12-06-2026"/>
        < Details />
        < Details />
      </div>
      <Footer />
    </div>
  )
}

export default Overdue
