import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, PDFViewer, StyleSheet, Font } from '@react-pdf/renderer';
import font from "../assets/Poppins-Medium.ttf";
import font2 from "../assets/Montserrat-Light.ttf";
import { useAuthContext } from '../Context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';

const styles = StyleSheet.create({
    // Add any additional styles here
    totalCost: {
        textAlign: 'right',
        fontSize: 14,
        fontWeight: "800",
    },
});

Font.register({
    family: "poppins",
    format: "truetype",
    src: font
});

Font.register({
    family: "flight",
    format: "truetype",
    src: font2
});

const Preview = () => {
    const { FPOS, setFPOS, selectedDate, selectedDate2 } = useAuthContext();
    const queryParams = new URLSearchParams(location.search);
    const [grand, setGrand] = useState("");

    const FETCHPOS = async () => {
        let url = queryParams.get("date").length > 0 ? `/api/pos/view/${queryParams.get("date")}/${queryParams.get("to")}` : `/api/pos/view`;
        const { data } = await axios.get(import.meta.env.VITE_API_URL + url, {
            headers: {
                "Content-Type": "application/json",
                token: Cookies.get("token"),
            },
        });
        setFPOS(data.result);
        if (queryParams.get("discount")) {
            setGrand(data.result.reduce((acc, curr) => Number(acc) + (curr.grandtotal), 0));
        } else {
            setGrand(data.result.reduce((acc, curr) => Number(acc) + (curr.total), 0));
        }
    };

    useEffect(() => {
        FETCHPOS();
    }, []);

    const rowsPerPage = 20;

    const renderRowsPerPage = () => {
        const pages = [];
        for (let i = 0; i < FPOS.length; i += rowsPerPage) {
            const rows = FPOS.slice(i, i + rowsPerPage);
            pages.push(
                <Page key={i} size="A4">
                    <View style={{
                        paddingHorizontal: 30, paddingVertical: 30,
                        fontFamily: "poppins",
                        height: "100%"
                    }}>
                        {queryParams.get("date").length > 0 && <> <Text style={{ fontSize: 12, fontFamily: "flight" }}>From: {queryParams.get("date")}</Text>
                            <Text style={{ fontSize: 12, fontFamily: "flight" }}>To: {queryParams.get("to")}</Text>
                        </>}
                        {i === 0 && <> <Text style={{ fontSize: 20, textAlign: "center" }}>APWA SALES REPORT</Text>
                        </>}
                        <View style={{
                            marginTop: 20,
                            fontFamily: "poppins"
                        }}>
                            <View style={{
                                flexDirection: "row",
                                backgroundColor: "#26247b",
                                paddingVertical: 10, paddingHorizontal: 20,
                                justifyContent: "space-between"
                            }}>
                                <Text style={{ width: "15%", fontSize: 12, color: "white" }}>Customer</Text>
                                <Text style={{ width: "25%", fontSize: 12, color: "white" }}>Products</Text>
                                <Text style={{ width: "15%", fontSize: 12, color: "white" }}>Discount</Text>
                                <Text style={{ width: "15%", fontSize: 12, color: "white" }}>Amount</Text>
                            </View>
                            {rows.map((elem, j) => {
                                return <View
                                    key={`row-${i + j}`}
                                    style={{
                                        flexDirection: "row",
                                        backgroundColor: "white",
                                        paddingTop: 3,
                                        paddingBottom: 3,
                                        justifyContent: "space-between",
                                        paddingHorizontal: 20,
                                        borderBottom: i + j === FPOS.length - 1 ? "0" : "1px solid gainsboro",
                                    }}
                                >
                                    <Text style={{ width: "15%", fontSize: 12, color: "black", paddingVertical: 5 }}>{i + j + 1}. {" "} {elem.customer}</Text>
                                    <Text style={{ width: "25%", fontSize: 12, color: "black", paddingVertical: 5 }}>{elem.products.map((el, ind) => `${el.name} ${ind === elem.products?.length - 1 ? "" : ", "}`)}</Text>
                                    <Text style={{ width: "15%", fontSize: 12, color: "black", paddingVertical: 5 }}>{elem.discount} %</Text>
                                    <Text style={{
                                        textAlign: "end",
                                        fontSize: 12,
                                        color: "black",
                                        paddingVertical: 5,
                                        width: "15%"
                                    }}>RS {queryParams.get("discount") ? Number(elem.grandtotal).toLocaleString() : Number(elem.total).toLocaleString()}</Text>
                                </View>
                            })}
                        </View>
                        {<View style={{
                            flexDirection: "row", backgroundColor: "#efeaf8",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            justifyContent: "space-between",
                            marginTop: 8
                        }}>
                            <Text style={{ width: "15%", fontSize: 12, color: "black", paddingVertical: 5 }}></Text>
                            <Text style={{ width: "25%", fontSize: 12, color: "black", paddingVertical: 5 }}></Text>
                            <Text style={{ width: "15%", fontSize: 12, color: "black", paddingVertical: 5 }}></Text>
                            <Text style={{
                                fontSize: 12,
                                color: "black",
                                color: "#26247b",
                                fontFamily: "poppins",
                                width: "20%"
                            }}>
                                Total: RS {Number(grand).toLocaleString()}
                            </Text>
                        </View>
                        }
                    </View>
                </Page>
            );
        }
        return pages;
    };

    return (
        <>
            <div style={{ minHeight: "100vh", width: "100vw" }}>
                <PDFViewer style={{ width: "100%", height: "100vh" }}>
                    <Document>
                        {renderRowsPerPage()}
                    </Document>
                </PDFViewer>
            </div>
        </>

    );
};

export default Preview;
