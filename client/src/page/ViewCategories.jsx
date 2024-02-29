import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import axios from 'axios'
import Cookies from 'js-cookie'
import { MdEdit, MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';

const ViewCategories = () => {
    const [products, setProducts] = useState([])

    const fetchData = async () => {
        try {
            const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/category/view", {
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

    const DeleteCategory = async (id) => {
        const confirmm = window.confirm("Are You Sure?");
        if (confirmm) {
            axios.post(import.meta.env.VITE_API_URL + `/api/category/delete/${id}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        token: Cookies.get("token"),
                    },
                })
            alert("Category Deleted")
            fetchData()
        }
    }

    const changeStatus = async (elem, st) => {
        try {
            axios.put(import.meta.env.VITE_API_URL + `/api/category/edit/${elem.id}`,
                {
                    status: st === "active" ? 0 : 1,
                    name: elem.name
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
        <div className='bg-gray-100  min-h-screen'>
            <Navbar />

            <div className="bg-gray-100 py-8 px-10 ml-[225px] min-h-screen">
                <div className="container mx-auto">
                    <div className="flex justify-between mb-2 items-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Categories</h1>
                        {/* <p className="text-lg text-gray-600 mb-8">Browse our latest collection of products designed to enhance your lifestyle.</p> */}
                        <Link to={"/addcategory"} className='bg-blue-700 text-white py-2 px-3 rounded-md'>Create Category</Link>
                    </div>
                    <div className="overflow-x-auto rounded-b-xl shadow">
                        <table className="table-auto w-full border-collapse">
                            <thead>
                                <tr className=" bg-gray-900 text-white uppercase">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white'>
                                {products?.map((elem) => {
                                    return <tr key={elem.id} className="border-b border-gray-100">
                                        <td className="px-6 py-4 text-center">{elem.name}</td>
                                        <td className="px-6 py-4 text-center">{elem.status === 0 ? "ACTIVE" : "NON ACTIVE"}</td>
                                        <td className="px-6 py-4 text-center flex justify-center">
                                            {elem.status === 1 ?
                                                <button className='px-3 py-1 bg-blue-700 me-3 text-white'
                                                    onClick={() => changeStatus(elem, "active")}>Mark Active</button>
                                                :
                                                <button className='px-3 py-1 bg-blue-700 me-3 text-white'
                                                    onClick={() => changeStatus(elem, "not")}>Mark Not Active</button>
                                            }
                                            <button className='px-3 py-1 bg-red-700 text-white'
                                                onClick={() => DeleteCategory(elem.id)}>Delete</button>
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

export default ViewCategories;

