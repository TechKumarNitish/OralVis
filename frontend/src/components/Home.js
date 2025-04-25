import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Your Smile, Our Priority
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Experience seamless dental care management. Connect with trusted dentists, schedule checkups, and track your oral health journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-center font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-center font-semibold transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://img.freepik.com/free-vector/dentist-concept-illustration_114360-1005.jpg" 
              alt="Dental Care Illustration" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Appointment Booking",
                description: "Schedule your dental checkups with just a few clicks",
                icon: "📅"
              },
              {
                title: "Expert Dentists",
                description: "Connect with qualified dental professionals",
                icon: "👨‍⚕️"
              },
              {
                title: "Health Tracking",
                description: "Keep track of your dental health history",
                icon: "📊"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Dental Care?</h2>
            <p className="text-xl mb-8">Join thousands of satisfied patients who trust us with their smiles</p>
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold inline-block hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


