
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

export default function Add_catogery() {
  const navigate = useNavigate();
  const [inputsdata, setInputsData] = useState({});

  const handleChange = (e) => {
    setInputsData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + "/api/category/add",
        {

          ...inputsdata
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: Cookies.get("token"),
          },
        })
      alert(data.message)
      setInputsData({name: "", status: ""})
      navigate("/viewcategories")
    } catch (error) {
      console.log(error);
    }
  }
  


  return (

    <div className="bg-gray-100 ml-[200px] min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center py-8">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add Category</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-wrap -mx-4">

              <div className="w-full px-4 mb-4">
                <label htmlFor="stock" className="text-left block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input id="name" type="text" name="name" onChange={handleChange} className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter Name" value={inputsdata.name} />
              </div>
              <div className="w-full  px-4 mb-4">
                <label htmlFor="category" className="text-left block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  id="status"
                  className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  defaultValue=""
                  onChange={handleChange}
                  value={inputsdata.status}
                >
                  <option value="" disabled>Select a status</option>
                  <option value="0">Active</option>
                  <option value="1">InActive</option>
                </select>

              </div>


            </div>
            <div className="text-center">
              <button type="submit" className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-300">Add Category</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
