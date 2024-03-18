import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuthContext } from '../Context/AuthContext';
import { Navigate, useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FcSalesPerformance } from "react-icons/fc";
import { FaCalendarAlt } from "react-icons/fa";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdPointOfSale } from "react-icons/md";
import { Line, Pie } from 'react-chartjs-2';
import loader from "../assets/loader.gif"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)


function Dashboard() {
    const [Tsales, setTsales] = useState("");
    const [Msales, setMsales] = useState("");
    const [Mpurchase, setMpurchase] = useState("");
    const [Tpurchase, setTpurchase] = useState("");
    const [salesR, setSalesR] = useState("");
    const [purchasedR, setPurchasedR] = useState("");
    const [pieArr, setPieArr] = useState([]);
    const { user } = useAuthContext();
    const [chartArr, setChartArray] = useState([])
    const [loading, setLoading] = useState(true);



    const fetchData = async () => {
        try {
            setLoading(true)
            const totalSales = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/sales", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });

            const monthlySales = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/salesmonthly", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });

            const Purchased = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/purchased", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });

            const monthlyPurchased = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/purchasedmonthly", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });


            const salesreturn = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/salesreturn", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });



            const purchasesreturn = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/returnpurchases", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });

            const chartData = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/getsales", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });

            const topData = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/top4products", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });

            setPieArr(topData.data)

            const resultArray2 = Array.from({ length: 12 }, (_, index) => {
                const month = (index + 1).toString().padStart(2, '0');
                const yearMonth = `${new Date().getFullYear()}-${month}`;
                const dataEntry = chartData.data.find(entry => {
                    return entry.month === yearMonth
                });
                return dataEntry ? Math.round(dataEntry.total_sales) : 0;
            });

            setChartArray(resultArray2)

            setTsales(totalSales.data.grandTotal ? totalSales.data.grandTotal : 0);
            setMsales(monthlySales.data.grandTotal ? monthlySales.data.grandTotal : 0);
            setTpurchase(Purchased.data.grandTotal ? Purchased.data.grandTotal : 0)
            setMpurchase(monthlyPurchased.data.grandTotal ? monthlyPurchased.data.grandTotal : 0)
            setSalesR(salesreturn.data.grandTotal ? salesreturn.data.grandTotal : 0)
            setPurchasedR(purchasesreturn.data.grandTotal ? purchasesreturn.data.grandTotal : 0)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error("Error fetching data:", error);
        }
    }


    const data = {
        labels: ["JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"],
        datasets: [
            {
                label: "Monthly Sales",
                data: chartArr.length > 0 ? chartArr : [],
                fill: true,
                backgroundColor: "#354A8A",
                borderColor: "rgb(52, 152, 219)"
            },
        ]
    };

    const data2 = {
        labels: pieArr?.map((elem) => elem.product_name),
        datasets: [
            {
                label: 'Total Sales',
                data: pieArr.length > 0 ? pieArr.map((elem) => elem.total_sold) : [],
                backgroundColor: [
                    '#fac858',
                    '#5470c6',
                    '#91cc75',
                    '#ee6666',
                ],
                borderColor: [
                    "#cfa037",
                    '#1b3687',
                    '#548c39',
                    '#bb4141',
                ],
                borderWidth: 1,
            },
        ],
    };




    useEffect(() => {
        fetchData();
    }, [])

    if (loading) return <img src={loader} className="loader" />;


    if (!user) return <Navigate to={"/"} />

    return (
        <div className="flex  min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex flex-col flex-grow py-8 px-10 ml-[225px] w_content">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <div className="flex ">
                    <div className="bg-white rounded-lg p-4 shadow-lg ml-3 " style={{ flex: 2, maxHeight: '12rem' }}> {/* Sales Overview card takes up 2/3 of the space */}
                        <h2 className="text-lg text-left font-semibold mb-4">Sales Overview</h2>
                        <div className="flex">
                            <div className="text-center flex-1 flex flex-col items-center justify-between">
                                <FcSalesPerformance size={50} />
                                <div>
                                    <p className="text-base mb-1">Sales</p>
                                    <p className="text-2xl">RS {Number(Tsales).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="text-center flex-1 flex flex-col items-center justify-between">
                                <FaCalendarAlt size={45} color='#3498db' />
                                <div>
                                    <p className="text-base  mb-1">Month Sales</p>
                                    <p className=" text-2xl">RS {Number(Msales).toLocaleString()} </p>
                                </div>
                            </div>
                            <div className="text-center flex-1 flex flex-col items-center justify-between">
                                <BiSolidPurchaseTagAlt size={50} color='#FFA000' />
                                <div>
                                    <p className="text-base  mb-1">Purchases</p>
                                    <p className=" text-2xl">RS {Number(Tpurchase).toLocaleString()} </p>
                                </div>
                            </div>
                            <div className="text-center flex-1 flex flex-col items-center justify-between">

                                <FaCalendarAlt size={45} color='#3498db' />
                                <div>
                                    <p className="text-base mb-1">Month Purchase</p>
                                    <p className=" text-2xl">RS {Number(Mpurchase).toLocaleString()} </p>
                                </div>
                            </div>
                            <div className="text-center flex-1 flex flex-col items-center justify-between">
                                <MdPointOfSale size={50} color='#3498db' />
                                <div>
                                    <p className="text-base mb-1">Returns</p>
                                    <p className=" text-2xl">RS {Number(salesR).toLocaleString()} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 justify-between mt-3 p-4 gap-7">
                    <div className='bg-white shadow-xl px-3 py-3 rounded'>
                        <h1 className='fw-bold mb-3 border-b pb-1'>Top Selling Products:</h1>
                        <Pie data={data2} />
                    </div>
                    <div className='bg-white shadow-xl p-3 rounded col-span-2'>
                        <h1 className='fw-bold mb-3 border-b pb-1'>Monthly Sales:</h1>
                        <div className="mt-2">
                            <Line data={data}
                                height={300}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
