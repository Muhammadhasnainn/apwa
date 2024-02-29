import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import axios from 'axios'
import Cookies from 'js-cookie'
import { MdEdit, MdDelete } from "react-icons/md";
const ViewProducts = () => {
    const [products, setProducts] = useState([])
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState({});

    const fetchData = async () => {
        try {
            const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/products/view", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });
            setProducts(data.result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const DeleteProduct = async (id) => {
        const confirmm = window.confirm("Are You Sure?");
        if (confirmm) {
            axios.post(import.meta.env.VITE_API_URL + `/api/products/delete/${selected}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        token: Cookies.get("token"),
                    },
                })
            alert("Product Deleted")
            fetchData()
        }
    }


    const EditProduct = async () => {
        try {
            await axios.put(import.meta.env.VITE_API_URL + `/api/products/edit/${selected.id}`,
                {
                    ...selected
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        token: Cookies.get("token"),
                    },
                })
            alert("Updated")
            setShow(false)
            setSelected({})
            fetchData()
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className='bg-gray-100  min-h-screen'>
            <Navbar />

            <div className="bg-gray-100 min-h-screen py-8 px-10 ml-[225px]">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Products</h1>
                    {/* <p className="text-lg text-gray-600 mb-8">Browse our latest collection of products designed to enhance your lifestyle.</p> */}

                    <div className="overflow-x-auto rounded-b-xl shadow">
                        <table className="table-auto w-full border-collapse">
                            <thead>
                                <tr className=" bg-gray-900 text-white uppercase">
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Model</th>
                                    <th className="px-6 py-4">Item code</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white'>
                                {products?.map((elem) => {
                                    return <tr key={elem.id} className="border-b border-gray-100">
                                        <td className="px-6 py-4 text-center">{elem.name}</td>
                                        <td className="px-6 py-4 text-center">{elem.model}</td>
                                        <td className="px-6 py-4 text-center">{elem.itemcode}</td>
                                        <td className="px-6 py-4 text-center">{elem.price}</td>
                                        <td className="px-6 py-4 text-center flex">
                                            <MdEdit size={30} color='blue' className='me-3'
                                                cursor={"pointer"}
                                                onClick={() => {
                                                    setSelected(elem)
                                                    setShow(true)
                                                }} />
                                            <MdDelete size={30} color='red'
                                                cursor={"pointer"} onClick={() => DeleteProduct(elem.id)} />

                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>




            {show && <div className='editModal'>
                <div className='editModalBox w-full bg-white p-5 rounded-md shadow md:w-1/2'>
                    <label>Name: </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full outline-none mt-1 border-gray-300 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        placeholder="Product Name"
                        value={selected.name}
                        onChange={(e) => setSelected({ ...selected, name: e.target.value })}
                    />
                    <div className='mt-2'>
                        <label>Model: </label>
                        <input
                            type="text"
                            name="model"
                            id="model"
                            className="block w-full outline-none mt-1 border-gray-300 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                            placeholder="Product Model"
                            value={selected.model}
                            onChange={(e) => setSelected({ ...selected, model: e.target.value })}
                        />
                    </div>
                    <div className='mt-2'>
                        <label>Price: </label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            className="block w-full outline-none mt-1 border-gray-300 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                            placeholder="Product Price"
                            value={selected.price}
                            onChange={(e) => setSelected({ ...selected, price: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button className='mt-5 bg-gray-500 text-white py-2 px-4 rounded-md me-3'
                            onClick={() => setShow(false)}>Close</button>
                        <button className='mt-5 bg-blue-700 text-white py-2 px-4 rounded-md'
                            onClick={EditProduct}>Edit</button>
                    </div>
                </div>
            </div>}

        </div>
    )
}

export default ViewProducts;

