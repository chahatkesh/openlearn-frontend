import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[100vh] flex flex-col justify-center hero-pattern" style={{backgroundColor: '#FFDE59'}}>
      <div className="absolute top-0 right-0 flex items-center py-4 px-6">
        <Link 
          to="/signin"
          className="mr-4 text-black hover:text-gray-800 font-medium transition duration-150 ease-in-out"
        >
          Sign In
        </Link>
        <Link 
          to="/signup"
          className="px-4 py-2 text-white font-medium rounded-md shadow-sm transition duration-300 ease-in-out"
          style={{ backgroundColor: '#000000' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1F2937'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
        >
          Sign Up
        </Link>
      </div>
      <div className="container max-w-[80vw] mx-auto px-4 py-16 pt-32 md:pt-20">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12">
            <div className="animate-fade-in">
              <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Starting June 15th, 2025
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{color: '#000000'}}>
                1st MLxFinance Cohort
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-lg" style={{color: '#374151'}}>
                Join the OpenLearn Community's inaugural cohort where Machine
                Learning meets Finance. Gain valuable skills and connect with
                fellow enthusiasts in this immersive learning experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="px-6 py-3 text-lg text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95 rounded-md font-medium cursor-pointer"
                  style={{backgroundColor: '#000000'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1F2937'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
                  onClick={() =>
                    document
                      .getElementById("join-cohort")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }>
                  Join Cohort 1.0{" "}
                  <ArrowRight size={18} className="ml-2 animate-pulse inline" />
                </button>
                <Link
                  to="/demo"
                  className="px-6 py-3 text-lg border-2 transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95 rounded-md font-medium cursor-pointer text-center flex items-center justify-center"
                  style={{borderColor: '#000000', color: '#000000'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  View Progress API Demo
                </Link>
                <button
                  className="px-6 py-3 text-lg border-2 transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95 rounded-md font-medium cursor-pointer"
                  style={{borderColor: '#000000', color: '#000000'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  onClick={() =>
                    document
                      .getElementById("program")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }>
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center lg:justify-end">
            <div className="relative animate-fade-in">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-black rounded-lg"></div>
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 relative transform transition-transform duration-300 hover:translate-y-[-5px]">
                <h2 className="font-bold text-xl mb-4 flex items-center">
                  <span className="rounded-full p-1 mr-2" style={{backgroundColor: '#FFDE59'}}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 1V15M1 8H15"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Program Highlights
                </h2>
                <ul className="space-y-4">
                  {[
                    "Hands-on ML projects with financial data",
                    "Expert-led sessions from industry leaders",
                    "Networking opportunities with finance & tech professionals",
                    "Certificate upon successful completion",
                    "1:1 mentorship sessions",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start group">
                      <div className="p-1 rounded-full mr-3 mt-1 transition-all duration-300 group-hover:scale-110" style={{backgroundColor: '#FFDE59'}}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M13.3334 4L6.00008 11.3333L2.66675 8"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;