import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaExclamationCircle, FaTrash } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const CheckupUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkup, setCheckup] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    additionalNote: '',
  });
  const [newPhoto, setNewPhoto] = useState({
    file: null,
    note: ''
  });

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
        
        setImages(data.checkup.images); 
        setCheckup(data.checkup);
        setFormData({
          status: data.checkup.status,
          additionalNote: data.checkup.additionalNote || ''
        });
      } catch (error) {
        setError('Failed to fetch checkup details');;
      } finally {
        setLoading(false);
      }
    };

    fetchCheckupDetails();// eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    setNewPhoto(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handlePhotoDescriptionChange = (e) => {
    setNewPhoto(prev => ({
      ...prev,
      note: e.target.value
    }));
  };

  const handleAddPhoto = async (event) => {
    event.preventDefault();
    if (!newPhoto.file || !newPhoto.note) return;

    try {
      const token = Cookies.get('token');
      const formData = new FormData();
      formData.append('image', newPhoto.file);
      formData.append('note', newPhoto.note);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checkups/${id}/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        toast.error('Failed to upload photo');
        return
      }

      const data = await response.json();
      setImages(prev=>[...prev,data.image]);
      setNewPhoto({ file: null, note: '' });
      toast.success('Photo uploaded successfully');
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checkups/${id}/image/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        toast.error('Failed to delete photo');
        return
      }

      await response.json();
      setImages(prev=>prev.filter((photo)=>photo._id  !==photoId));
      toast.success('Photo deleted successfully');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      
      // Update only status and notes
      await fetch(`${process.env.REACT_APP_API_URL}/api/checkups/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: formData.status,
          additionalNote: formData.additionalNote
        })
      });

      navigate(`/dentist/requests`);
      toast.success('Checkup updated successfully');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

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

  if (error) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Update Checkup Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Update the checkup information for {checkup.patient.name}.<br/>
            <span className="font-semibold">Reason for Visit:</span> {checkup.reason}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="border-t border-gray-200">
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <div className="sm:col-span-3">
              <label htmlFor="additionalNote" className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                id="additionalNote"
                name="additionalNote"
                rows={3}
                value={formData.additionalNote}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Checkup Photos
              </label>
              <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images && images.map((photo) => (
                  <div key={photo._id} className="relative group">
                    <img
                      src={`${process.env.REACT_APP_API_URL}${photo.url}`}
                      alt={`Checkup ${photo._id}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="mt-2 text-sm text-gray-500">{photo.note}</p>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo._id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Add New Photo
              </label>
              <div className="mt-1 flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
                <div className="flex space-x-4">
                  <textarea
                    placeholder="Add a detailed description of the photo..."
                    value={newPhoto.note}
                    onChange={handlePhotoDescriptionChange}
                    rows={3}
                    className="flex-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    disabled={!newPhoto.file || !newPhoto.note}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 h-fit"
                  >
                    Add Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={() => navigate(`/dentist/checkups/${id}`)}
              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckupUpdate; 