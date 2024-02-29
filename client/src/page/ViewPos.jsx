import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import axios from 'axios'
import Cookies from 'js-cookie'
import { MdEdit, MdDelete } from "react-icons/md";
import Invoice from '../components/Invoice';

const ViewPOS = () => {
    const [POS, setPOS] = useState([])
    const [show, setShow] = useState(false);
    const [inputsdata, setInputsData] = useState({});
    const [selected, setSelected] = useState([]);
    const [total, setTotal] = useState(0)


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
        <div className='bg-gray-100   min-h-screen'>
            <Navbar />

            <div className="bg-gray-100 py-8 px-10 min-h-screen ml-[225px]">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Recent Sales</h1>

                    <div className="overflow-x-auto rounded-b-xl shadow">
                        <table className="table-auto w-full border-collapse ">
                            <thead>
                                <tr className=" bg-gray-900 text-white ">
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Products</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white'>
                                {POS?.map((elem) => {
                                    return <tr key={elem.id} className="border-b border-gray-100">
                                        <td className="px-6 py-4 text-center">{elem.customer}</td>
                                        <td className="px-6 py-4 text-center">{elem.products.map((elem) => elem.name)}</td>
                                        <td className="px-6 py-4 text-center">{Number(elem.total).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className='flex justify-center'>
                                                <MdEdit size={30} color='blue' className='' />
                                                <button className='bg_primary px-5 py-2 rounded text-white ms-3'
                                                onClick={()=> {
                                                    const {products, ...data} = elem;
                                                    setSelected(products)
                                                    setInputsData(data)
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
                </div>
                {show && <Invoice close={() => setShow(false)} inputsdata={inputsdata}
                    products={selected}
                    total={total}
                />}
            </div>

        </div>
    )
}

export default ViewPOS;

