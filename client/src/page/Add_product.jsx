import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Add_product() {
  const [inputsdata, setInputsData] = useState({});
  const [category, setcategory] = useState([]);


  const handleChange = (e) => {
    setInputsData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(import.meta.env.VITE_API_URL + "/api/products/add",
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
    setInputsData({})
    e.target.reset()
  }

  // console.log(inputsdata);
  useEffect(() => {
    const FETCHDATA = async () => {
      const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/category/view",

        {
          headers: {
            "Content-Type": "application/json",
            token: Cookies.get("token"),
          },

        })
      console.log(data);
      setcategory(data.result)

    }
    FETCHDATA()
  }, [])


  return (
    <div className="bg-gray-100 min-h-screen  flex flex-col">
      {/* Navbar */}
      <div className="hidden md:block ">
        <Navbar />
      </div>
      {/* Add Product Form */}
      <div className="flex-1 py-8 px-10 ml-[225px] w_content flex justify-center items-center md:px-0">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add Product</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-wrap -mx-2 md:-mx-4">
              <div className="w-full md:w-1/2 px-2 md:px-4 mb-4">
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input id="name" type="text" name="itemName"
                  value={inputsdata.name} className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter item name" onChange={handleChange} required/>
              </div>
              <div className="w-full md:w-1/2 px-2 md:px-4 mb-4">
                <label htmlFor="itemModel" className="block text-sm font-medium text-gray-700 mb-1">Item Model</label>
                <input id="model" type="text" name="itemModel"
                  value={inputsdata.model} className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter item model" onChange={handleChange} required/>
              </div>
              <div className="w-full md:w-1/2 px-2 md:px-4 mb-4">
                <label htmlFor="itemCode" className="block text-sm font-medium text-gray-700 mb-1">Item Code</label>
                <input id="itemcode" type="text" name="itemCode"
                  className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter item code" onChange={handleChange} required
                  value={inputsdata.itemcode} />
              </div>
              <div className="w-full md:w-1/2 px-2 md:px-4 mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input id="price" type="number" name="price" className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter price" required
                  onChange={handleChange} value={inputsdata.price} />
              </div>
              <div className="w-full px-2 md:px-4 mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" id="category" className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" defaultValue="" required
                  onChange={handleChange}>
                  <option value="" disabled>Select a category</option>
                  {category?.map((elem) => {
                    return <option value={elem.name}>{elem.name}</option>
                  })}
                </select>
              </div>
              <div className="w-full px-2 md:px-4 mb-4">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input id="stock" type="number" name="stock" className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter stock"
                  onChange={handleChange} value={inputsdata.stock} required/>
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="bg_primary  text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-300">Add Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>


  );
}
