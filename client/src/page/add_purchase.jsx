import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MdDelete } from 'react-icons/md';

const AddPurchase = () => {
  const [inputsdata, setInputsData] = useState({});
  const [supplier, setSupplier] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [Fproducts, setFproducts] = useState([]);
  const [total, setTotal] = useState(0)


  const handleChange = (e) => {
    setInputsData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (Object.values(inputsdata).length === 1) {
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

      setSelected([])
      alert(data.message)
    } else {
      alert("FILL ALL FIELDS!")
    }
  }

  const handleQuantityChange = (id, change, price) => {
    const index = selected.findIndex(item => item.idd === id);
    if (index !== -1) {
      const updatedSelected = [...selected];
      updatedSelected[index].quantity += Number(change);

      if (updatedSelected[index].quantity < 1) {
        updatedSelected[index].quantity = 1;
      } else {
        updatedSelected[index].subtotal = price * updatedSelected[index].quantity;
      }

      setSelected(updatedSelected);
    } else {
      console.error(`Item with id ${id} not found in the selected array.`);
    }
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

  const FetchSuppliers = async () => {
    const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/purchases/viewsup",
      {
        headers: {
          "Content-Type": "application/json",
          token: Cookies.get("token"),
        },

      })
    setSupplier(data.result)

  }

  useEffect(() => {
    const FETCHDATA = async () => {
      FetchSuppliers()
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


  const AddSupplier = async () => {
    const promptt = window.prompt("Enter Supplier Name: ");
    if (promptt) {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + "/api/purchases/addsupplier",
        {
          name: promptt
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: Cookies.get("token"),
          },
        })

      alert(data.message)
      FetchSuppliers()
    }
  }


  useEffect(() => {
    const totalAmount = selected.reduce((prev, curr) => prev + curr.subtotal, 0);
    setTotal(totalAmount)
  }, [selected])


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">


      <Navbar />
      <div className='ml-[225px] w_content'>
        <h1 className="text-3xl py-6 px-10 font-bold">Create Purchase</h1>
        <div className='py-0 px-10'>
          <div className="grid grid-cols-2 gap-8">
            {/* First Card */}
            <div className="w-[100%] h-[99%] bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm text-left font-medium text-gray-700 mt-4">Select a Category</label>
                  <div className="mt-1 relative flex items-center">
                    <select
                      name="supplier"
                      id="supplier"
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                      defaultValue=""
                    >
                      <option value="" disabled>Select a supplier</option>
                      {supplier?.map((elem) => {
                        return <option value={elem.name}>{elem.name}</option>
                      })}
                    </select>
                    <button className='bg_primary px-3 py-1 ms-3 text-2xl text-white'
                      onClick={AddSupplier}>+</button>
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
                              onClick={() => handleQuantityChange(elem.idd, -1, elem.price)}>-</button>
                            <input className='mx-3 w-6' value={elem?.quantity}
                              onChange={(e) => handleQuantityInput(i, e.target.value, elem.price)} type='number' />
                            <button className='bg-blue-800 text-white px-2'
                              onClick={() => handleQuantityChange(elem.idd, 1, elem.price)}>+</button>
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
            <div className="bg-white w-[100%] h-[99%] rounded-lg shadow-md overflow-hidden">
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
                  {Fproducts?.map((elem, i) => {
                    return <div className="bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer"
                      onClick={() => {
                        const elementToAdd = { ...elem, idd: i, quantity: 1, subtotal: 1 * elem.price };
                        if (!selected.some(selectedElem => {
                          const { subtotal: subtotal1, quantity: quantity1, ...newObject } = selectedElem;
                          const { subtotal: subtotal2, quantity: quantity2, ...newObject2 } = elementToAdd;
                          return JSON.stringify(newObject) === JSON.stringify(newObject2)
                        })) {
                          setSelected([...selected, elementToAdd]);
                        } else {
                          handleQuantityChange(elementToAdd.idd, 1, elem.price)
                        }
                      }}
                    >
                      <h3 className="text-gray-800 font-bold">{elem.name}</h3>
                      <p className="text-gray-600">RS {elem.price}</p>
                    </div>
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* <!-- 3rd Card --> */}
          <div className="w-[34.5%]  mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              {/* <!-- Third Card Content --> */}
              <div className="text-center text-2xl w-50 h-17 font-bold bg-blue-950 bg-opacity-20 p-4">
                Net Total: RS {total.toLocaleString()}
              </div>
            </div>
          </div>

          {/* <!-- Button --> */}
          <div className="col-12 col-lg-5 mb-1 py-4">
            <button className="bg_primary hover:bg-blue-700 text-white font-bold py-2 px-20 "
              onClick={handleSubmit}>
              <i className="fas fa-save"></i> Save
            </button>
          </div>

        </div>
      </div>
    </div>

  );
};

export default AddPurchase;
