import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const DentistList = () => {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const token = Cookies.get('token');
        const options = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/dentists`, options);
        const data = await response.json();
        setDentists(data.data.dentists);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDentists();
  }, []);

  const filteredDentists = dentists.filter((dentist) =>
    dentist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dentist.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Available Dentists</h1>
            <p className="mt-2 text-sm text-gray-700">
              Browse through our list of qualified dentists and request a checkup appointment.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md p-3"
              placeholder="Search dentists by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="border-t border-gray-200">
                      <div className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ) : filteredDentists.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Email
                        </th>
                       
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredDentists.map((dentist) => (
                        <tr key={dentist._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {dentist.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {dentist.email}
                          </td>
                         
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link
                              to={{
                                pathname: '/patient/checkup/request',
                                state: { dentistId: dentist._id }
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Request Checkup
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No dentists found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentistList; 