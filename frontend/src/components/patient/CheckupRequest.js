import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'; 

const CheckupRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    dentistId: location.state?.dentistId || '',
    appointmentDate: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.dentistId) {
      newErrors.dentistId = 'Please select a dentist';
    }
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Please select an appointment date';
    } else if (new Date(formData.appointmentDate) < new Date()) {
      newErrors.appointmentDate = 'Appointment date cannot be in the past';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     
    if (validateForm()) {
      try {
        const token = Cookies.get('token');
        const options = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        };
        await fetch (`${process.env.REACT_APP_API_URL}/api/checkups`, options);
        toast.success('Checkup request submitted successfully');
        navigate('/checkup/history');
      } catch (error) {
        toast.error( 'Failed to submit checkup request');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Request Checkup</h1>
            <p className="mt-2 text-sm text-gray-700">
              Fill out the form below to request a dental checkup appointment.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="dentistId"
                className="block text-sm font-medium text-gray-700"
              >
                Select Dentist
              </label>
              <select
                id="dentistId"
                name="dentistId"
                value={formData.dentistId}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  errors.dentistId ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                disabled={loading || !!location.state?.dentistId}
              >
                <option value="">Select a dentist</option>
                {dentists.map((dentist) => (
                  <option key={dentist._id} value={dentist._id}>
                    Dr. {dentist.name}
                  </option>
                ))}
              </select>
              {errors.dentistId && (
                <p className="mt-1 text-sm text-red-600">{errors.dentistId}</p>
              )}
            </div>
            <div>
                <label
                htmlFor="appointmentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Reason for Visit 
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                rows={3}
              />
            </div>
            <div>
              <label
                htmlFor="appointmentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Appointment Date
              </label>
              <input
                type="datetime-local"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.appointmentDate ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.appointmentDate && (
                <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/patient/dentists')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckupRequest; 