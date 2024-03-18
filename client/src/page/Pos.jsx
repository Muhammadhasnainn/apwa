import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MdClose, MdDelete } from 'react-icons/md';
import Invoice from '../components/Invoice';

const Pos = () => {
    const [inputsdata, setInputsData] = useState({ discount: 10 });
    const [category, setcategory] = useState([]);
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState([]);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState("")
    const [Fproducts, setFproducts] = useState([]);
    const [id, setID] = useState("");
    const [total, setTotal] = useState(0)
    const [inputsdata2, setInputsData2] = useState({});

    const handleChange2 = (e) => {
        if (e.target.id === "price" && parseFloat(e.target.value) < 0) {
            return;
        }

        if (e.target.id === "stock" && parseFloat(e.target.value) < 0) {
            return;
        }

        setInputsData2((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        const { data } = await axios.post(import.meta.env.VITE_API_URL + "/api/products/add",
            {
                ...inputsdata2
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            })

        alert(data.message)
        setInputsData2({})
        setShow2(false)
        FetchProducts()
        e.target.reset()
    }


    const handleChange = (e) => {
        if (e.target.id === "discount" && parseFloat(e.target.value) < 0) {
            return;
        }
        setInputsData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit = async () => {
        if (Object.values(inputsdata).length === 3) {
            try {
                const totalAmount = selected.reduce((prev, curr) => prev + curr.subtotal, 0);

                const { data } = await axios.post(import.meta.env.VITE_API_URL + "/api/pos/add",
                    {
                        ...inputsdata,
                        total: (Math.round((totalAmount - (totalAmount / 100 * inputsdata.discount)) / 10) * 10),
                        products: selected,
                        grandtotal: totalAmount
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            token: Cookies.get("token"),
                        },
                    })

                alert(data.message)
                setID(data.id)
                setShow(true)
                // setSelected([])
            } catch (error) {
                console.log(error);
                alert(error?.response?.data?.message)
            }
        } else {
            alert("FILL ALL FIELDS!")
        }
    }

    useEffect(() => {
        const FETCHDATA = async () => {
            const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/category/viewactive",

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

    const FetchProducts = async () => {
        const products = await axios.get(import.meta.env.VITE_API_URL + "/api/products/view", {
            headers: {
                "Content-Type": "application/json",
                token: Cookies.get("token"),
            },
        });
        setProducts(products.data.result);
        setFproducts(products.data.result);
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

    useEffect(() => {
        const totalAmount = selected.reduce((prev, curr) => prev + curr.subtotal, 0);
        setTotal(totalAmount)
    }, [selected])


    return (
        <div className="flex flex-col min-h-screen bg-gray-100 py-8 px-10 ">
            <Navbar />
            <div className='w_content ml-[225px] '>
                <h1 className="text-3xl font-bold mb-4">Create Sale</h1>
                <div className=" grid grid-cols-2 gap-8 justify-between">
                    <div className="w-[100%] h-[99%] bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                            <div className="mb-4">
                                <label htmlFor="client" className="block text-sm text-left font-medium text-gray-700">Select a Client</label>
                                <div className="mt-1 relative">
                                    <input
                                        type="text"
                                        name="client"
                                        id="customer"
                                        className="block outline-none w-full border-gray-300 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                                        placeholder="Select a client"
                                        onChange={handleChange}
                                    />
                                </div>
                                <label htmlFor="category" className="block text-sm text-left font-medium text-gray-700 mt-4">Select a Category</label>
                                <div className="mt-1 relative">
                                    <select
                                        name="category"
                                        id="category"
                                        onChange={handleChange}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                                        defaultValue="" // Set default value if needed
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {category?.map((elem) => {
                                            return <option value={elem.id}>{elem.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2">Product</th>
                                            <th className="border px-4 py-2 text-center">Quantity</th>
                                            <th className="border px-4 py-2 text-center">Price</th>
                                            <th className="border px-4 py-2 text-center">Subtotal</th>
                                            <th className="border px-4 py-2 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selected.length > 0 ? selected?.map((elem, i) => {
                                            return <tr>
                                                <td className="border px-4 py-2">{elem.name}</td>
                                                <td className="border px-4 py-2" style={{ whiteSpace: "nowrap" }}>
                                                    <button className='bg-red-600 text-white px-2'
                                                        onClick={() => handleQuantityChange(elem.idd, -1, elem.price)}>-</button>
                                                    <input className='mx-3 w-6 text-center' value={elem?.quantity}
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

                    <div className="bg-white w-[100%] h-[99%] rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                            <div className="col-md-12 form-group">
                                <div className="flex w-full">
                                    <div className="search-area border flex items-center w-full flex-grow-1">
                                        <div className="search-btn d-inline-block px-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            name="client"
                                            id="client"
                                            className="block w-[90%] outline-none border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
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
                                    <button className='bg_primary px-3 py-1 ms-3 text-2xl text-white'
                                        onClick={() => setShow2(true)}>+</button>
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
                                        }} >
                                        <h3 className="text-gray-800 font-bold">{elem.name}</h3>
                                        <p className="text-gray-600">RS {elem.price}</p>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- 3rd Card --> */}
                <div className="w-[34.5%] mt-8 bg-white  rounded-lg shadow-md overflow-hidden py-2">

                    <div className="mt-1 relative px-3">
                        <label className="block text-sm text-left font-medium text-gray-700">Discount %</label>
                        <input
                            type="number"
                            name="discount"
                            id="discount"
                            value={inputsdata.discount}
                            className="block mt-1 px-3 outline-none w-full border-gray-300 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2"
                            placeholder="Enter Discount %"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="p-2">
                        <div className="text-center text-2xl w-50 h-17 font-bold bg-blue-950 bg-opacity-20 p-4">
                            Net Total: RS   <span className="original-price text-red-700">{total.toLocaleString()}</span>
                            <span className="discounted-price text-blue-500 font-bold">{(Math.round((total - (total / 100 * inputsdata.discount)) / 10) * 10).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-5 mb-1 py-4">
                    <button className="bg_primary hover:bg-blue-700 text-white font-bold py-2 px-20 "
                        onClick={handleSubmit}>
                        <i className="fas fa-save"></i> Save
                    </button>
                </div>

                {show && <Invoice close={() => setShow(false)} inputsdata={inputsdata}
                    products={selected}
                    discount={inputsdata.discount}
                    total={(Math.round((total - (total / 100 * inputsdata.discount)) / 10) * 10)}
                    id={id}
                />}
            </div>

            {show2 && <div className="h-full w-full bg-gray-300  fixed top-0 left-0 flex justify-center">
                <div className="w-full flex flex-col">
                    {/* Navbar */}
                    {/* Add Product Form */}
                    <div className="flex-1 py-8 px-10 flex justify-center items-center md:px-0">
                        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl">
                            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add Product</h2>
                            <form className="space-y-4" onSubmit={handleSubmit2}>
                                <div className="flex flex-wrap -mx-2 md:-mx-4">
                                    <MdClose className='absolute top-5 right-10' size={30}
                                        cursor={"pointer"} onClick={() => setShow2(false)} />
                                    <div className="w-full md:w-1/2 px-2 md:px-4 mb-4">
                                        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                        <input id="name" type="text" name="itemName"
                                            value={inputsdata2.name} className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter item name" onChange={handleChange2} required />
                                    </div>
                                    <div className="w-full md:w-1/2 px-2 md:px-4 mb-4">
                                        <label htmlFor="itemModel" className="block text-sm font-medium text-gray-700 mb-1">Item Model</label>
                                        <input id="model" type="text" name="itemModel"
                                            value={inputsdata2.model} className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter item model" onChange={handleChange2} required />
                                    </div>
                                    <div className="w-full md:w-1/2 px-2 md:px-4 mb-4">
                                        <label htmlFor="itemCode" className="block text-sm font-medium text-gray-700 mb-1">Item Code</label>
                                        <input id="itemcode" type="text" name="itemCode"
                                            className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter item code" onChange={handleChange2} required
                                            value={inputsdata2.itemcode} />
                                    </div>
                                    <div className="w-full md:w-1/2 px-2 md:px-4 mb-4">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                        <input id="price" type="number" name="price" className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter price" required
                                            onChange={handleChange2} value={inputsdata2.price} />
                                    </div>
                                    <div className="w-full px-2 md:px-4 mb-4">
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select name="category" id="category" className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" defaultValue="" required
                                            onChange={handleChange2}>
                                            <option value="" disabled>Select a category</option>
                                            {category?.map((elem) => {
                                                return <option value={elem.id}>{elem.name}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="w-full px-2 md:px-4 mb-4">
                                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                        <input id="stock" type="number" name="stock" className="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" placeholder="Enter stock"
                                            onChange={handleChange2} value={inputsdata2.stock} required />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="bg_primary  text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-300">Add Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    );
};

export default Pos;
