import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';


const ShareInvoice = () => {
    // Get invoiceId from URL - replace with actual routing logic
    const invoiceId = window.location.pathname.split('/').pop();
    const invoiceRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [invoice, setInvoice] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchInvoice();
    }, [invoiceId]);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/api/v1/invoice/get/${invoiceId}`);

            if (response.data.success) {
                setInvoice(response.data.data);
            } else {
                showSnackbar('Failed to fetch invoice', 'error');
            }
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Error fetching invoice', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
        setTimeout(() => setSnackbar({ ...snackbar, open: false }), 8000);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const downloadInvoice = async () => {
        try {
            setDownloading(true);
            showSnackbar('Generating PDF...', 'info');

            const element = invoiceRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Invoice-${invoice._id}.pdf`);

            showSnackbar('Invoice downloaded successfully!', 'success');
        } catch (error) {
            showSnackbar('Failed to download invoice', 'error');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading invoice...</p>
                </div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600">Invoice not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={8000}
                onClose={handleCloseSnackbar}
                position={{ vertical: 'top', horizontal: 'right' }}
            />

            <div className="max-w-3xl mx-auto mb-6 flex justify-end">
                <button
                    onClick={downloadInvoice}
                    disabled={downloading}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg shadow-lg hover:scale-[1.03] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                    {downloading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Invoice
                        </>
                    )}
                </button>
            </div>

            <div ref={invoiceRef} className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-third/20">
                {/* Header */}
                <div className="border-b-2 border-primary/20 pb-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">EatWana</h1>
                            <p className="text-sm text-gray-600">Cloud Kitchen & Tiffin Service</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-2xl font-bold text-gray-800">INVOICE</p>
                            <p className="text-sm text-gray-600 mt-1">#{invoice._id}</p>
                            <p className="text-sm text-gray-600">{formatDate(invoice.createdAt)}</p>
                        </div>
                    </div>
                </div>

                {/* From & To Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {/* From */}
                    <div className="border border-third/20 rounded-xl p-5 bg-white shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">From</h3>
                        <div className="space-y-1.5">
                            <p className="font-bold text-gray-800 text-lg">EatWana Cloud Kitchen</p>
                            <p className="text-sm text-gray-600">D.V.C, Road</p>
                            <p className="text-sm text-gray-600">Gardanibhag, Patna - 1</p>
                            <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Phone:</span> +91 97082 77467
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span> eatwana@gmail.com
                            </p>
                        </div>
                    </div>

                    {/* To */}
                    <div className="border border-third/20 rounded-xl p-5 bg-white shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">To</h3>
                        <div className="space-y-1.5">
                            <p className="font-bold text-gray-800 text-lg">{invoice.customer.name}</p>
                            <p className="text-sm text-gray-600">{invoice.customer.address}</p>
                            <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Phone:</span> {invoice.customer.mobile}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span> {invoice.customer.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Meal Plan Summary */}
                <div className="border border-third/20 rounded-lg p-6 bg-third/5 mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Meal Plan Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-600 mb-1">Meals Per Day</p>
                            <p className="text-2xl font-bold text-primary">{invoice.mealPlan.mealsPerDay}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-600 mb-1">Price Per Meal</p>
                            <p className="text-2xl font-bold text-primary">₹{invoice.mealPlan.pricePerMeal}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-600 mb-1">Total Price</p>
                            <p className="text-2xl font-bold text-primary">₹{invoice.mealPlan.totalPrice}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-primary/10">
                            <span className="text-gray-700 font-medium">Amount Paid</span>
                            <span className="text-xl font-bold text-primary">₹{invoice.amountPaid}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-primary/10">
                            <span className="text-gray-700 font-medium">Tokens Created</span>
                            <span className="text-lg font-semibold text-gray-800">{invoice.tokensCreated}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-primary/10">
                            <span className="text-gray-700 font-medium">Previous Token Balance</span>
                            <span className="text-lg font-semibold text-gray-800">{invoice.previousTokenBalance}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-gray-700 font-bold">New Token Balance</span>
                            <span className="text-xl font-bold text-primary">{invoice.newTokenBalance}</span>
                        </div>
                    </div>
                </div>

                {/* Invoice Metadata */}
                <div className="bg-gray-50 rounded-lg p-5 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <p className="text-sm text-gray-600">Invoice ID</p>
                            <p className="font-semibold text-gray-800">{invoice._id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Created Date</p>
                            <p className="font-semibold text-gray-800">{formatDate(invoice.createdAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-800 mb-2">Notes</h3>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>This invoice is generated automatically by the system.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Please keep it for future reference.</span>
                        </li>
                    </ul>
                </div>

                {/* Terms & Conditions */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-base font-bold text-gray-800 mb-2">Terms & Conditions</h3>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Meals are non-refundable once delivered.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Token deductions happen instantly upon meal delivery.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Billing disputes must be reported within 24 hours.</span>
                        </li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Thank you for choosing EatWana!</p>
                    <p className="text-xs text-gray-400 mt-1">This is a computer-generated invoice and does not require a signature.</p>
                </div>
            </div>
        </div>
    );
};

export default ShareInvoice;