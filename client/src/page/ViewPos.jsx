import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import axios from 'axios'
import Cookies from 'js-cookie'
import { MdEdit,MdDelete  } from "react-icons/md";

const ViewPOS = () => {
    const [POS, setPOS] = useState([])
    
    const fetchData = async () => {
        try {
            const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/pos/view", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });
            setPOS(data.result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className='bg-gray-100 ml-[200px] min-h-screen'>
            <Navbar />
           
            <div className="bg-gray-100 min-h-screen">
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Recent Sales</h1>
        
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200 text-gray-700 uppercase">
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Products</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className='bg-white'>
                    {POS?.map((elem)=>{
                    return <tr key={elem.id} className="border-b border-gray-100">
                     <td className="px-6 py-4 text-center">{elem.customer}</td>
                   <td className="px-6 py-4 text-center">{elem.products.map((elem)=> elem.name)}</td>
                   <td className="px-6 py-4 text-center">{Number(elem.total).toLocaleString()}</td>
                   <td className="px-6 py-4 text-center">
                    <MdEdit size={30} color='blue' className='mx-auto'/>
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

export default ViewPOS;

