import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import axios from 'axios'
import Cookies from 'js-cookie'
import { MdEdit, MdDelete } from "react-icons/md";
const ViewPurchase = () => {
    const [products, setProducts] = useState([])

    const fetchData = async () => {
        try {
            const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/purchases/view", {
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



    const changeStatus = async (elem) => {
        try {
            axios.put(import.meta.env.VITE_API_URL + `/api/purchases/edit/${elem.id}`,
                {
                    status: elem.status === 1 ? 0 : 1
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        token: Cookies.get("token"),
                    },
                })
            alert("Status changed!")
            fetchData()
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className='bg-gray-100 min-h-screen'>
            <Navbar />

            <div className="bg-gray-100 min-h-screen py-8 px-10 ml-[225px] w_content">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Purchase</h1>
                    {/* <p className="text-lg text-gray-600 mb-8">Browse our latest collection of products designed to enhance your lifestyle.</p> */}

                    <div className="overflow-x-auto rounded-b-xl shadow mt-4">
                        <table className="table-auto w-full border-collapse">
                            <thead>
                                <tr className="bg-[#e2e8f0] text-black">
                                    <th className="px-6 py-4">Supplier</th>
                                    <th className="px-6 py-4">Products</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white'>


                                {products?.map((elem) => {
                                    return <tr key={elem.id} className="border-b border-gray-100">
                                        <td className="px-6 py-4 text-center">{elem.supplier}</td>
                                        <td className="px-6 py-4 text-center">{elem.products.map((el, i) => `${el.name} ${i !== (elem.products.length - 1) ? ", " : " "}`)}</td>
                                        <td className="px-6 py-4 text-center">{elem.products.map((el, i) => `${el?.quantity} ${i !== (elem.products.length - 1) ? ", " : " "}`)}</td>

                                        <td className="px-6 py-4 text-center text-[#ff5724]">RS {Number(elem.total).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">{elem.status === 1 ? <span className='px-3 py-2 rounded-3 rounded-lg text-white bg-green-300'>PAID</span> : <span className='px-3 py-2 rounded-lg text-sm text-white bg-red-400'>Not Paid</span>}</td>
                                        <td className="px-6 py-4 text-center">
                                            {elem.status === 0 ? <button className='bg-blue-500 text-white px-3 py-2 rounded-lg' onClick={() => changeStatus(elem)}>Mark Paid</button> :
                                                <button className='bg-blue-500 text-white px-3 py-2 rounded-lg' onClick={() => changeStatus(elem)}>Mark Not Paid</button>
                                            }
                                        </td>

                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ViewPurchase;

