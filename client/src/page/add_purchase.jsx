import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MdDelete } from 'react-icons/md';

const Pos = () => {
  const [inputsdata, setInputsData] = useState({});
  const [category, setcategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [Fproducts, setFproducts] = useState([]);
  const [total, setTotal] = useState(0)


  const handleChange = (e) => {
    setInputsData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async () => {
    const totalAmount = selected.reduce((prev, curr) => prev + curr.subtotal, 0);

    const { data } = await axios.post(import.meta.env.VITE_API_URL + "/api/purchases/add",
      {
        ...inputsdata,
        total: totalAmount,
        products: selected
      },
      {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token"),
        },
      })

    alert(data.message)
  }

  const handleQuantityChange = (index, change, price) => {
    const updatedSelected = [...selected];
    updatedSelected[index].quantity += Number(change);
    if (updatedSelected[index].quantity < 1) {
      updatedSelected[index].quantity = 1;
    } else {
      updatedSelected[index].subtotal = price * updatedSelected[index].quantity;
    }
    setSelected(updatedSelected);
  };


  const handleQuantityInput = (index, change, price) => {
    const updatedSelected = [...selected];
    updatedSelected[index].quantity = Number(change);
    if (updatedSelected[index].quantity < 1) {
      updatedSelected[index].quantity = 1;
    } else {
      updatedSelected[index].subtotal = price * updatedSelected[index].quantity;
    }

    setSelected(updatedSelected);
  };


  useEffect(() => {
    const FETCHDATA = async () => {
      const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/category/view",

        {
          headers: {
            "Content-Type": "application/json",
            token: Cookies.get("token"),
          },

        })
      setcategory(data.result)

      const products = await axios.get(import.meta.env.VITE_API_URL + "/api/products/view", {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token"),
        },
      });
      setProducts(products.data.result);
      setFproducts(products.data.result);
    }
    FETCHDATA()
  }, [])


  useEffect(() => {
    const totalAmount = selected.reduce((prev, curr) => prev + curr.subtotal, 0);
    setTotal(totalAmount)
  }, [selected])


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center p-8">Create Purchase</h1>

      <Navbar />

      <div className="grid grid-cols-2 gap-8 ml-[220px]">
        {/* First Card */}
        <div className="w-[85%] h-[99%] bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            {/* Client Selection Input */}
            <div className="mb-4">
              <label htmlFor="client" className="block text-sm text-left font-medium text-gray-700">Select a Supplier</label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name="supplier"
                  id="supplier"
                  className="block w-full border-gray-300 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Select a supplier"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Product</th>
                    <th className="border px-4 py-2 text-center">Quantity</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2 text-center">Subtotal</th>
                    <th className="border px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.length > 0 ? selected.map((elem, i) => {
                    return <tr>
                      <td className="border px-4 py-2">{elem.name}</td>
                      <td className="border px-4 py-2" style={{ whiteSpace: "nowrap" }}>
                        <button className='bg-red-600 text-white px-2'
                          onClick={() => handleQuantityChange(i, -1, elem.price)}>-</button>
                        <input className='mx-3 w-6' value={elem?.quantity}
                          onChange={(e) => handleQuantityInput(i, e.target.value, elem.price)} type='number' />
                        <button className='bg-blue-800 text-white px-2'
                          onClick={() => handleQuantityChange(i, 1, elem.price)}>+</button>
                      </td>
                      <td className="border px-4 py-2">{elem.price}</td>
                      <td className="border px-4 py-2">{(elem.price * elem.quantity).toLocaleString()}</td>
                      <td className="border text-center px-4 py-2">
                        <MdDelete size={20} color='red' cursor={"pointer"}
                          onClick={() => {
                            const updatedSelected = [...selected];
                            updatedSelected.splice(i, 1);
                            setSelected(updatedSelected)
                          }} />
                      </td>
                    </tr>
                  }) : <tr>
                    <td className="border px-4 py-2 text-center" colSpan={5}>No Products Selected</td>
                  </tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="bg-white w-[85%] h-[99%] rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            {/* Third Card Content */}
            <div className="col-md-12 form-group">
              <div className="d-flex w-100">
                <div className="search-area flex items-center  border flex-grow-1">
                  <div className="search-btn d-inline-block px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="client"
                    id="client"
                    className="block w-[90%]  outline-none border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    placeholder="Select a products"
                    onChange={(e) => {
                      const filteredArray = products.filter(item => {
                        const lowercasedItem = item.name.toLowerCase();
                        const lowercasedStartingLetters = e.target.value.toLowerCase();
                        return lowercasedItem.startsWith(lowercasedStartingLetters);
                      });

                      setFproducts(filteredArray)
                    }}
                  />
                  <label className="search-btn d-none">
                    <i className="fas fa-times"></i>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Products</h2>
            <div className="grid grid-cols-3 gap-4">
              {Fproducts.map((elem) => {
                return <div className="bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer"
                  onClick={() => {
                    const elementToAdd = { ...elem, quantity: 1, subtotal: 1 * elem.price };
                    if (!selected.some(selectedElem => {
                      const { subtotal: subtotal1, quantity: quantity1, ...newObject } = selectedElem;
                      const { subtotal: subtotal2, quantity: quantity2, ...newObject2 } = elementToAdd;
                      return JSON.stringify(newObject) === JSON.stringify(newObject2)
                    })) {
                      setSelected([...selected, elementToAdd]);
                    }
                  }}
                >
                  <h3 className="text-gray-800 font-bold">{elem.name}</h3>
                  <p className="text-gray-600">${elem.price}</p>
                </div>
              })}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- 3rd Card --> */}
      <div className="w-[34.5%] ml-[220px] mt-8 bg-white  rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          {/* <!-- Third Card Content --> */}
          <div className="text-center text-2xl w-50 h-17 font-bold bg-blue-950 bg-opacity-20 p-4">
            Net Total: $ {total.toLocaleString()}
          </div>
        </div>
      </div>

      {/* <!-- Button --> */}
      <div className="col-12 col-lg-5 mb-1 py-4">
        <button className="bg-blue-500 ml-[220px] hover:bg-blue-700 text-white font-bold py-2 px-20 "
          onClick={handleSubmit}>
          <i className="fas fa-save"></i> Save
        </button>
      </div>



    </div>

  );
};

export default Pos;
