import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { format } from 'date-fns';
import { FaExclamationCircle } from 'react-icons/fa';
import Cookies from 'js-cookie';
import ExportPDFButton from './patient/ExportPdf';
import { useAuth } from '../context/AuthContext';
const CheckupDetails = () => {
  const {user}=useAuth();
  const { id } = useParams();
  const [checkup, setCheckup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  
    const fetchCheckupDetails = async () => {
      try {
        const token = Cookies.get('token');
        const options = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checkups/${id}`, options);  
        const data = await response.json();
        setCheckup(data.checkup);
      } catch (error) {
        setError('Failed to fetch checkup details');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckupDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="mt-4 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !checkup) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error || 'Checkup not found'}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="report-content">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Checkup Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Detailed information about your checkup.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Dentist</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Dr. {checkup.dentist.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Appointment Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {format(new Date(checkup.appointmentDate), 'PPP')}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  checkup.status === 'completed' ? 'bg-green-100 text-green-800' :
                  checkup.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {checkup.status.charAt(0).toUpperCase() + checkup.status.slice(1)}
                </span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Reason for Visit</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {checkup.reason || 'No reason provided'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Additional Notes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {checkup.additionalNote || 'No additional notes provided'}
              </dd>
            </div>
            {checkup.images && checkup.images.length > 0 && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Images</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    {checkup.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`${process.env.REACT_APP_API_URL}${image.url}`}
                          className="w-full h-48 object-cover rounded-lg"
                          alt="note"
                        />
                        <p className="mt-2 text-sm text-gray-500">{image.note}</p>
                      </div>
                    ))}
                  </div>
                </dd>
              </div>
            )}
            

          </dl>
          
        </div>
      
      </div>
      {user?.role === 'patient' && <ExportPDFButton />}
    </div>
  );
};

export default CheckupDetails; 