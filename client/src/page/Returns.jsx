import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import axios from 'axios'
import Cookies from 'js-cookie'
import { MdEdit, MdDelete } from "react-icons/md";
import Invoice from '../components/Invoice';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../Context/AuthContext';

const Returns = () => {
    const { FPOS, setFPOS } = useAuthContext();
    const [POS, setPOS] = useState([]);
    const [show, setShow] = useState(false);
    const [inputsdata, setInputsData] = useState({});
    const [selected, setSelected] = useState([]);
    const [discount, setDiscount] = useState("");
    const [currentPage, setcurrentPage] = useState(1);
    const [selectedDate, setSelectedD] = useState("")
    const [total, setTotal] = useState(0)
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/pos/viewreturns", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });
            setPOS(data.result);
            setFPOS(data.result)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }



    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className='bg-gray-100   min-h-screen'>
            <Navbar />

            <div className="bg-gray-100 py-8 px-10 min-h-screen ml-[225px] w_content">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Return Sales</h1>
                       
                    </div>
                    <div className="overflow-x-auto rounded-b-xl shadow mt-3">
                        <table className="table-auto w-full border-collapse ">
                            <thead>
                                <tr className=" bg-[#e2e8f0] text-black ">
                                    <th className="px-5 py-4">Date</th>
                                    <th className="px-6 py-4 ">Customer</th>
                                    <th className="px-6 py-4">Products</th>
                                    <th className="px-6 py-4">Total</th>
                                </tr>
                            </thead>


                            <tbody className='bg-white'>


                                {FPOS?.map((elem) => {
                                    return <tr key={elem.id} className="border-b border-gray-100">
                                        <td className="px-5 py-4 text-center">{elem.date}</td>
                                        <td className="px-6 py-4 text-center">{elem.customer}</td>
                                        <td className="px-6 py-4 text-center">{elem.products.map((elem) => `${elem.name} `)}</td>
                                        <td className="px-6 py-4 text-center text-[#10b981]">RS {Number(elem.products.reduce((acc,curr ) => {return acc + curr.price*curr.quantity}, 0))}</td>
                                        {/* <td className="px-6 py-4">
                                            <div className='flex justify-center'> */}
                                                {/* <MdEdit size={30} color='blue'
                                                    onClick={() => navigate(`/return/${elem.id}`)}
                                                    cursor={"pointer"} /> */}
                                                {/* <button className='bg_primary px-5 py-2 rounded text-white ms-3'
                                                    onClick={() => {
                                                        const { products, ...data } = elem;
                                                        setSelected(products)
                                                        setInputsData(data)
                                                        setDiscount(elem.discount)
                                                        setTotal(elem.total)
                                                        setShow(true)
                                                    }}>View</button> */}
                                            {/* </div> */}
                                        {/* </td> */}
                                    </tr>
                                })}
                            </tbody>
                        </table>

                    </div>
                    <div className='flex justify-between items-center mt-4'>
                        {currentPage !== 1 && <button className='bg-gray-300 px-3 py-2 rounded'>Previous</button>
                        }
                        {FPOS.length === 100 && <button className='bg_primary px-4 py-2 rounded text-white'>Next</button>
                        }</div>
                </div>
                {show && <Invoice close={() => setShow(false)} inputsdata={inputsdata}
                    products={selected}
                    total={total}
                    discount={discount}
                />}
            </div>


        </div>
    )
}

export default Returns;

