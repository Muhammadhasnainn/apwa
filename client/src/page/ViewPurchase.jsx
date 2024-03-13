import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import axios from 'axios'
import Cookies from 'js-cookie'
import { MdEdit,MdDelete  } from "react-icons/md";
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
                        <th className="px-6 py-4">Total</th>
                        {/* <th className="px-6 py-4">Action</th> */}
                    </tr>
                </thead>
                <tbody className='bg-white'>
            
                
                    {products?.map((elem)=>{
                    return <tr key={elem.id} className="border-b border-gray-100">
                     <td className="px-6 py-4 text-center">{elem.supplier}</td>
                   <td className="px-6 py-4 text-center">{elem.products.map((el, i)=> `${el.name} ${i !== (elem.products.length - 1) ? ", " : " "}`)}</td>
                   <td className="px-6 py-4 text-center text-[#ff5724]">RS {Number(elem.total).toLocaleString()}</td>
                   {/* <td className="px-6 py-4 text-center flex">
                    <MdEdit size={30} color='blue' className='mx-auto'/>
                    </td> */}
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

