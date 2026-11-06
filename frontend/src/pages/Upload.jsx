
import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import PucForm from "../components/PucForm";

const Upload = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <Navbar />

      <main className="max-w-7xl mx-auto px-5 md:px-12 py-12">

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            Upload <span className="text-green-500">PUC Certificate</span>
          </h1>

          <p className="text-gray-400 mt-3">
            Add your vehicle details and upload your pollution certificate.
          </p>
        </div>

        <PucForm />

      </main>

      <Footer />

    </div>
  );
};

export default Upload;
