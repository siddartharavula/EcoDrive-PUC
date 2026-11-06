
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function Home() {
  const token = localStorage.getItem("ecodriveToken");
  const savedUser = localStorage.getItem("ecodriveUser");

  const isLoggedIn = Boolean(token && savedUser);

  return (
    <div className="bg-gray-900 text-white">
      <Navbar />

      <section className="py-20 flex flex-col justify-center items-center text-center px-8">
        <h1 className="text-6xl font-extrabold text-green-400">
          Drive Clean. Breath Clean.
        </h1>
        <p className="mt-8 text-xl text-gray-300 max-w-3xl leading-9">
          EcoDrive helps vehicle owners manage Pollution Under Control (PUC)
          certificates, monitor emissions, receive expiry reminders and
          contribute towards a cleaner and healthier environment.
        </p>
      </section>

      <section className="px-12 py-24">
        <h2 className="text-4xl font-bold text-green-400 mb-8">
          Why Air Pollution Matters
        </h2>
        <p className="text-gray-300 text-2xl leading-9">
          Air pollution has become one of the world's most serious environmental
          challenges. Millions of people suffer from respiratory illnesses,
          cardiovascular diseases and reduced quality of life because of
          polluted air. Rapid urbanization, industrial growth and increasing
          vehicle usage have significantly worsened air quality across cities.
        </p>
      </section>

      <section className="bg-gray-800 px-12 py-24">
        <h2 className="text-4xl font-bold text-green-400 mb-8">
          Vehicles: A Major Source of Pollution
        </h2>
        <p className="text-gray-300 text-2xl leading-9">
          Petrol and diesel vehicles release harmful gases during combustion.
          Poorly maintained engines emit even larger quantities of pollutants,
          increasing health risks and environmental damage.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-14">
          <div className="bg-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              Carbon Monoxide
            </h3>
            <p className="text-gray-300">
              A poisonous gas that reduces oxygen delivery to body tissues,
              causing dizziness, headaches and serious health issues.
            </p>
          </div>

          <div className="bg-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              Carbon Dioxide
            </h3>
            <p className="text-gray-300">
              A greenhouse gas responsible for global warming and climate
              change.
            </p>
          </div>

          <div className="bg-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              Nitrogen Oxides
            </h3>
            <p className="text-gray-300">
              Causes smog, acid rain and severe respiratory diseases.
            </p>
          </div>

          <div className="bg-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              Hydrocarbons
            </h3>
            <p className="text-gray-300">
              Unburned fuel that contributes to ground-level ozone and air
              pollution.
            </p>
          </div>

          <div className="bg-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              Particulate Matter
            </h3>
            <p className="text-gray-300">
              Tiny particles that enter the lungs and bloodstream causing
              chronic illnesses.
            </p>
          </div>

          <div className="bg-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              Sulfur Dioxide
            </h3>
            <p className="text-gray-300">
              Damages crops, forests and contributes to acid rain.
            </p>
          </div>
        </div>
      </section>

      <section className="px-12 py-24">
        <h2 className="text-4xl font-bold text-green-400 mb-8">
          Why Every Vehicle Needs a PUC Test
        </h2>
        <p className="text-gray-300 text-2xl leading-9">
          A Pollution Under Control (PUC) certificate confirms that your
          vehicle's emissions are within government-approved limits. Regular
          testing reduces harmful emissions, improves engine efficiency,
          increases fuel economy and ensures legal compliance.
        </p>
      </section>

      <section className="bg-gray-800 px-12 py-24">
        <h2 className="text-4xl font-bold text-green-400 mb-10">
          How EcoDrive Helps
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-gray-700 p-6 rounded-xl">Digital PUC Storage</div>
          <div className="bg-gray-700 p-6 rounded-xl">QR Code Verification</div>
          <div className="bg-gray-700 p-6 rounded-xl">Expiry Reminders</div>
          <div className="bg-gray-700 p-6 rounded-xl">Vehicle Emission History</div>
          <div className="bg-gray-700 p-6 rounded-xl">Admin Dashboard</div>
          <div className="bg-gray-700 p-6 rounded-xl">Compliance Tracking</div>
          <div className="bg-gray-700 p-6 rounded-xl">Secure Authentication</div>
          <div className="bg-gray-700 p-6 rounded-xl">Analytics & Reports</div>
        </div>
      </section>

      <section className="px-12 py-24">
        <h2 className="text-4xl font-bold text-green-400 text-center mb-16">
          Why It Matters
        </h2>
        <div className="grid md:grid-cols-4 gap-10 text-center">
          <div>
            <h1 className="text-5xl font-bold text-green-400">7M+</h1>
            <p className="mt-4 text-gray-300">
              Premature deaths linked to air pollution every year.
            </p>
          </div>

          <div>
            <h1 className="text-5xl font-bold text-green-400">24%</h1>
            <p className="mt-4 text-gray-300">
              Global CO₂ emissions come from transportation.
            </p>
          </div>

          <div>
            <h1 className="text-5xl font-bold text-green-400">100%</h1>
            <p className="mt-4 text-gray-300">
              Digital storage for all your PUC certificates.
            </p>
          </div>

          <div>
            <h1 className="text-5xl font-bold text-green-400">24×7</h1>
            <p className="mt-4 text-gray-300">
              Access your vehicle records anytime.
            </p>
          </div>
        </div>
      </section>

      {!isLoggedIn && (
        <section className="bg-green-600 py-20 text-center">
          <h1 className="text-5xl font-bold">Join EcoDrive Today</h1>
          <p className="mt-6 text-xl">
            Keep your vehicle compliant. Protect the environment.
          </p>
          <Link
            to="/login"
            className="inline-block mt-8 bg-white text-green-700 px-10 py-4 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            Get Started
          </Link>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default Home;
