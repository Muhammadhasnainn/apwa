import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import axios from 'axios'
import Cookies from 'js-cookie'
import { MdEdit, MdDelete } from "react-icons/md";
import Invoice from '../components/Invoice';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../Context/AuthContext';

const ViewPOS = () => {
    const { FPOS, setFPOS, withDiscount, setwithDiscount, selectedDate, setSelectedD, selectedDate2, setSelectedD2  } = useAuthContext();
    const [POS, setPOS] = useState([]);
    const [show, setShow] = useState(false);
    const [inputsdata, setInputsData] = useState({});
    const [selected, setSelected] = useState([]);
    const [discount, setDiscount] = useState("");
    const [currentPage, setcurrentPage] = useState(1);
    const [total, setTotal] = useState(0)
    const navigate = useNavigate();


    const fetchAllData = async () => {
        try {
            const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/pos/view", {
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
    const FETCHPOS = async (date, date2) => {
        if (date) {
            setSelectedD(date)
        }
        if (date2) {
            setSelectedD2(date2)
        }

        if (date && date2) {
            let url = `/api/pos/viewfilter?fromDate=${date}&toDate=${date2}`;
            const { data } = await axios.get(import.meta.env.VITE_API_URL + url,

                {
                    headers: {
                        "Content-Type": "application/json",
                        token: Cookies.get("token"),
                    },

                })
            setFPOS(data.result)
        }
    }

    const fetchData = async () => {
        try {
            const url = selectedDate ? `/api/pos/view/${selectedDate}/${selectedDate2}?page=${currentPage}&limit=100` : `/api/pos/view?page=${currentPage}&limit=100`;
            const { data } = await axios.get(import.meta.env.VITE_API_URL + url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        token: Cookies.get("token"),
                    },

                })

            setFPOS(data.result)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        fetchData();
    }, [currentPage, selectedDate, withDiscount]);

    useEffect(() => {
        fetchData();
        fetchAllData()
    }, [])


    return (
        <div className='bg-gray-100   min-h-screen'>
            <Navbar />

            <div className="bg-gray-100 py-8 px-10 min-h-screen ml-[225px] w_content">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Recent Sales</h1>
                        <div className="flex items-center">
                            <input type="date" onChange={(e) => FETCHPOS(e.target.value, selectedDate2)}
                                className='px-3 py-2  me-3 rounded-sm shadow outline-none cursor-pointer'
                                value={selectedDate} />
                            <input type="date" onChange={(e) => FETCHPOS(selectedDate, e.target.value)}
                            value={selectedDate2}
                                className='px-3 py-2  me-3 rounded-sm shadow outline-none cursor-pointer'
                            />
                            <div>
                                <button className='bg_primary px-3 py-2 me-2 text-white rounded'
                                    onClick={() => {
                                        setFPOS(POS)
                                        setSelectedD("")
                                        setSelectedD2("")
                                    }}>Show All</button>

                                <button className='bg-green-400 px-3 py-2  me-3 text-white rounded'
                                    onClick={() => withDiscount ? window.open(`/preview?date=${selectedDate}&to=${selectedDate2}`, "_blank") :  window.open(`/preview?date=${selectedDate}&to=${selectedDate2}&discount=false`, "_blank")}>Download</button>
                                <button className='btn bg-red-700 text-white px-3 py-2 rounded'
                                    onClick={() => setwithDiscount(!withDiscount)}>{withDiscount ? "Remove" : "With"} Discount</button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-b-xl shadow mt-3">
                        <table className="table-auto w-full border-collapse ">
                            <thead>
                                <tr className=" bg-[#e2e8f0] text-black ">
                                    <th className="px-6 py-4 ">Customer</th>
                                    <th className="px-6 py-4">Products</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Discount</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>

                            <tbody className='bg-white'>
                                {FPOS?.map((elem) => {
                                    return <tr key={elem.id} className="border-b border-gray-100">
                                        <td className="px-6 py-4 text-center">{elem.customer}</td>
                                        <td className="px-6 py-4 text-center">{elem.products.map((elem) => `${elem.name} `)}</td>
                                        <td className="px-6 py-4 text-center text-[#10b981]">RS {withDiscount ? Number(elem.total).toLocaleString() : Number(elem.grandtotal).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center text-[#4261ff]">{Number(elem.discount)} %</td>
                                        <td className="px-6 py-4">
                                            <div className='flex justify-center'>
                                                <MdEdit size={30} color='blue'
                                                    onClick={() => navigate(`/return/${elem.id}`)}
                                                    cursor={"pointer"} />
                                                <button className='bg_primary px-5 py-2 rounded text-white ms-3'
                                                    onClick={() => {
                                                        const { products, ...data } = elem;
                                                        setSelected(products)
                                                        setInputsData(data)
                                                        setDiscount(elem.discount)
                                                        setTotal(elem.total)
                                                        setShow(true)
                                                    }}>View</button>
                                            </div>
                                        </td>
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
                    id={inputsdata.id}
                />}
            </div>


        </div>
    )
}

export default ViewPOS;

