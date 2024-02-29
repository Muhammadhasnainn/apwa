import React from 'react'

const Invoice = (props) => {
    const handlePrint = () => {
        window.print()
    };

    return (

        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto" >
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl p_shadow transition-all sm:my-8 sm:w-full sm:max-w-lg"
                     id='content'>
                        <div className="bg-slate-400 px-3 py-1">
                            <h1 className='text-xl'>Invoice Receipt</h1>
                        </div>
                        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                            <div className='mt-3 px-10'>
                                <p className='text-sm my-1'>Date: 19-02-2002</p>
                                <p className='text-sm my-1'>Address : 2nd Floor, Progressive Plaza, Karachi</p>
                                <p className='text-sm my-1'>Email : support@orientsoftsolutions.com</p>
                                <p className='text-sm my-1'>Phone : 32323243434</p>
                                <p className='text-sm my-1'>Client : Walking Customer</p>
                                <p className='text-sm my-1'>Sold By : Super Admin</p>

                                <div className='mt-4'>
                                    {props?.products?.map((elem) => {
                                        return <div className='flex mt-3 justify-between items-center border-b-gray-950 border-dotted border-b-2 pb-1'>
                                            <div>
                                                <p className='mb-0'>{elem.name}</p>
                                                <p className='text-sm'>{elem.quantity} PCs</p>
                                            </div>
                                            <p className='text-xl'>${elem.price * elem.quantity}</p>
                                        </div>
                                    })}
                                    <div className='flex mt-5 justify-between items-center border-b-gray-950 border-dotted border-b-2 pb-1'>
                                        <p className='font-bold'>Subtotal</p>
                                        <p className='font-bold'>$ {props.total}</p>
                                    </div>
                                </div>
                                <p className='text-sm my-5 text-center font-extrabold' >Thank You For Choosing Us. Please Come Again!</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 flex justify-between mb-3 mt-6 p_none">
                            <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto" onClick={props.close}>Close</button>
                            <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold  shadow-sm bg_primary text-white sm:mt-0 sm:w-auto"
                                onClick={handlePrint}>Print</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Invoice