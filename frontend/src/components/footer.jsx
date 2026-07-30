import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white px-20 py-8">

      <div className="flex flex-col md:flex-row justify-between">

        {/* Left */}
        <div>
          <h1 className="text-2xl font-bold text-green-500">
            ecoDrive
          </h1>

          <p className="text-gray-400 mt-2 max-w-sm">
            Promoting cleaner transportation through smart vehicle
            emission tracking and timely PUC reminders.
          </p>
        </div>

        {/* Middle */}
        <div className="mt-6 md:mt-0">
          <h2 className="text-lg font-semibold mb-3">
            Quick Links
          </h2>

          <ul className="space-y-2 text-gray-400">
            <li>Home</li>
            <li>Track</li>
            <li>Upload</li>
            <li>Overdue</li>
          </ul>
        </div>

        {/* Right */}
        <div className="mt-6 md:mt-0">
          <h2 className="text-lg font-semibold mb-3">
            Contact
          </h2>

          <p className="text-gray-400">
            support@ecodrive.com
          </p>

          <p className="text-gray-400">
            Hyderabad, India
          </p>
        </div>

      </div>

      <hr className="my-6 border-gray-700" />

      <p className="text-center text-gray-500 text-sm">
        © 2026 ecoDrive. All Rights Reserved.
      </p>

    </footer>
  )
}

export default Footer