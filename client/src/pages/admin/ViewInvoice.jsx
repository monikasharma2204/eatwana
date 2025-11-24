import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';

const ViewInvoice = () => {
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
        setTimeout(() => setSnackbar(prev => ({ ...prev, open: false })), 8000);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
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

    // Helper function to convert modern CSS colors to supported formats
    const convertColorsForCanvas = (element) => {
        const clone = element.cloneNode(true);
        const allElements = clone.querySelectorAll('*');

        const convertColor = (color) => {
            if (!color) return color;
            // Convert oklab, oklch, lab, lch to fallback colors
            if (color.includes('oklab') || color.includes('oklch') ||
                color.includes('lab(') || color.includes('lch(')) {
                // Create a temporary element to compute the color
                const temp = document.createElement('div');
                temp.style.color = color;
                document.body.appendChild(temp);
                const computed = getComputedStyle(temp).color;
                document.body.removeChild(temp);
                return computed || '#000000';
            }
            return color;
        };

        const processElement = (el) => {
            const styles = getComputedStyle(el);
            const propsToCheck = [
                'color', 'backgroundColor', 'borderColor',
                'borderTopColor', 'borderRightColor',
                'borderBottomColor', 'borderLeftColor',
                'outlineColor', 'textDecorationColor'
            ];

            propsToCheck.forEach(prop => {
                const value = styles[prop];
                if (value && (value.includes('oklab') || value.includes('oklch') ||
                    value.includes('lab(') || value.includes('lch('))) {
                    el.style[prop] = convertColor(value);
                }
            });
        };

        allElements.forEach(processElement);
        processElement(clone);

        return clone;
    };

    const downloadInvoice = async () => {
        try {
            setDownloading(true);
            showSnackbar('Generating PDF...', 'info');

            const element = invoiceRef.current;

            // Create a clone for PDF generation
            const clone = element.cloneNode(true);

            // Create a container for the clone
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '800px';
            container.style.backgroundColor = '#ffffff';
            container.appendChild(clone);
            document.body.appendChild(container);

            // Fix grid layouts by converting to flexbox with explicit widths
            const gridElements = clone.querySelectorAll('.grid');
            gridElements.forEach(grid => {
                const cols = grid.className.match(/grid-cols-(\d+)/);
                const smCols = grid.className.match(/sm:grid-cols-(\d+)/);

                // Use sm: breakpoint column count if available
                const colCount = smCols ? parseInt(smCols[1]) : (cols ? parseInt(cols[1]) : 1);

                // Convert grid to flexbox
                grid.style.display = 'flex';
                grid.style.flexWrap = 'wrap';
                grid.style.gap = '1.5rem';

                // Set width on children
                const children = grid.children;
                const childWidth = colCount > 1 ? `calc(${100 / colCount}% - 1rem)` : '100%';

                Array.from(children).forEach(child => {
                    child.style.width = childWidth;
                    child.style.minWidth = childWidth;
                    child.style.flexShrink = '0';
                });
            });

            // Fix any flex layouts that might be stacking
            const flexElements = clone.querySelectorAll('.flex');
            flexElements.forEach(flex => {
                if (flex.className.includes('sm:flex-row') || flex.className.includes('flex-row')) {
                    flex.style.flexDirection = 'row';
                }
                if (flex.className.includes('justify-between')) {
                    flex.style.justifyContent = 'space-between';
                }
                if (flex.className.includes('items-center')) {
                    flex.style.alignItems = 'center';
                }
            });

            // Ensure text alignments for sm: breakpoints
            clone.querySelectorAll('[class*="sm:text-"]').forEach(el => {
                if (el.className.includes('sm:text-right')) {
                    el.style.textAlign = 'right';
                }
                if (el.className.includes('sm:text-left')) {
                    el.style.textAlign = 'left';
                }
            });

            // Wait for styles to apply
            await new Promise(resolve => setTimeout(resolve, 150));

            // Optimized canvas settings for smaller file size
            const canvas = await html2canvas(clone, {
                scale: 1.5, // Reduced from 2 to 1.5 for smaller file size
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: 800,
                windowWidth: 800,
                height: clone.scrollHeight,
            });

            // Cleanup
            document.body.removeChild(container);

            // Convert to JPEG with optimized quality for much smaller file size
            const imgData = canvas.toDataURL('image/jpeg', 0.85); // JPEG at 85% quality

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true // Enable PDF compression
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const contentWidth = pdfWidth - (margin * 2);
            const imgHeight = (canvas.height * contentWidth) / canvas.width;

            // Fit to one page - scale down if needed
            if (imgHeight > (pdfHeight - margin * 2)) {
                const scale = (pdfHeight - margin * 2) / imgHeight;
                const scaledWidth = contentWidth * scale;
                const scaledHeight = imgHeight * scale;
                const xOffset = (pdfWidth - scaledWidth) / 2;
                pdf.addImage(imgData, 'JPEG', xOffset, margin, scaledWidth, scaledHeight, undefined, 'FAST');
            } else {
                pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, imgHeight, undefined, 'FAST');
            }

            pdf.save(`Invoice-${invoice.invoiceNumber || invoice._id}.pdf`);
            showSnackbar('Invoice downloaded successfully!', 'success');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            showSnackbar('Failed to download invoice. Please try again.', 'error');
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

            <div className="max-w-3xl mx-auto mb-4 flex justify-end">
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

            <div ref={invoiceRef} className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-third/20" style={{ width: '800px' }}>
                {/* Header - Compact */}
                <div className="border-b-2 border-primary/20 pb-3 mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <img src='/logo.webp' className='w-16 h-auto' alt="EatWana Logo" />
                            <p className="text-xs text-gray-600 mt-1">Cloud Kitchen & Tiffin Service</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-gray-800">INVOICE</p>
                            <p className="text-xs text-gray-600 mt-1">#{invoice.invoiceNumber || invoice._id}</p>
                            <p className="text-xs text-gray-600">{formatDate(invoice.createdAt)}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${(invoice.invoiceType || 'mealPlan') === 'dish' ? 'bg-blue-100 text-blue-700' :
                                (invoice.invoiceType || 'mealPlan') === 'tiffin' ? 'bg-purple-100 text-purple-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                {(invoice.invoiceType || 'mealPlan').toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* From & To Section - Compact */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* From */}
                    <div className="border border-third/20 rounded-lg p-3 bg-white">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">From</h3>
                        <p className="font-bold text-gray-800 text-sm">EatWana Cloud Kitchen</p>
                        <p className="text-xs text-gray-600">D.V.C, Road, Gardanibhag</p>
                        <p className="text-xs text-gray-600">Patna - 1</p>
                        <p className="text-xs text-gray-600 mt-1">Phone: +91 97082 77467</p>
                        <p className="text-xs text-gray-600">Email: eatwana@gmail.com</p>
                    </div>

                    {/* To */}
                    <div className="border border-third/20 rounded-lg p-3 bg-white">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">To</h3>
                        <p className="font-bold text-gray-800 text-sm">{invoice.customer?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-600">{invoice.deliveryAddress || invoice.customer?.address || 'N/A'}</p>
                        <p className="text-xs text-gray-600 mt-1">Phone: {invoice.customer?.mobile || 'N/A'}</p>
                        <p className="text-xs text-gray-600">Email: {invoice.customer?.email || 'N/A'}</p>
                    </div>
                </div>

                {/* Items Table (for Dish/Tiffin) */}
                {(invoice.invoiceType === 'dish' || invoice.invoiceType === 'tiffin') && invoice.items && invoice.items.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-bold text-gray-800 mb-2">Order Items</h3>
                        <table className="w-full border-collapse border border-third/20 text-xs">
                            <thead>
                                <tr className="bg-primary/10">
                                    <th className="border border-third/20 p-2 text-left">Item</th>
                                    <th className="border border-third/20 p-2 text-center">Qty</th>
                                    <th className="border border-third/20 p-2 text-right">Unit Price</th>
                                    <th className="border border-third/20 p-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="border border-third/20 p-2">
                                            <p className="font-medium text-gray-800">{item.itemName}</p>
                                            <p className="text-gray-500 text-xs">
                                                {item.selectedVariant && `${item.selectedVariant}`}
                                                {item.category && ` • ${item.category}`}
                                            </p>
                                        </td>
                                        <td className="border border-third/20 p-2 text-center">{item.quantity}</td>
                                        <td className="border border-third/20 p-2 text-right">₹{item.unitPrice.toLocaleString()}</td>
                                        <td className="border border-third/20 p-2 text-right font-semibold">₹{item.totalPrice.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Meal Plan Summary (only for mealPlan) */}
                {invoice.invoiceType === 'mealPlan' && invoice.mealPlan && (
                    <div className="border border-third/20 rounded-lg p-3 bg-third/5 mb-4">
                        <h3 className="text-sm font-bold text-gray-800 mb-2">Meal Plan Summary</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <p className="text-xs text-gray-600 mb-1">Meals/Day</p>
                                <p className="text-lg font-bold text-primary">{invoice.mealPlan.mealsPerDay}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-600 mb-1">Price/Meal</p>
                                <p className="text-lg font-bold text-primary">₹{invoice.mealPlan.pricePerMeal}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-600 mb-1">Total Price</p>
                                <p className="text-lg font-bold text-primary">₹{invoice.mealPlan.totalPrice?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Summary - Compact */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-3">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Payment Summary</h3>
                    <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-700">Subtotal</span>
                            <span className="font-medium">₹{invoice.subtotal?.toLocaleString() || (invoice.totalAmount || invoice.amountPaid || 0).toLocaleString()}</span>
                        </div>
                        {invoice.discount > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-700">Discount</span>
                                <span className="font-medium text-green-600">-₹{invoice.discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-1 border-t border-primary/20">
                            <span className="text-gray-800 font-bold">Total Amount</span>
                            <span className="text-lg font-bold text-primary">₹{(invoice.totalAmount || invoice.amountPaid || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-gray-600">Payment Method</span>
                            <span className="font-medium">{(invoice.paymentMethod || 'COD').toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status</span>
                            <span className={`font-medium ${invoice.paymentStatus === 'paid' ? 'text-green-600' :
                                invoice.paymentStatus === 'pending' ? 'text-yellow-600' :
                                    'text-red-600'
                                }`}>
                                {(invoice.paymentStatus || 'PENDING').toUpperCase()}
                            </span>
                        </div>
                        {invoice.utrNumber && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">UTR/Transaction ID</span>
                                <span className="font-mono text-xs">{invoice.utrNumber}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Token Details (only for mealPlan) */}
                {invoice.invoiceType === 'mealPlan' && invoice.tokensCreated > 0 && (
                    <div className="bg-gray-50 border border-third/20 rounded-lg p-3 mb-3">
                        <h3 className="text-sm font-bold text-gray-800 mb-2">Token Transaction</h3>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tokens Created</span>
                                <span className="font-bold text-green-600">+{invoice.tokensCreated}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Previous Balance</span>
                                <span className="font-medium">{invoice.previousTokenBalance || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">New Balance</span>
                                <span className="font-bold text-primary">{invoice.newTokenBalance || 0}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer - Compact */}
                <div className="border-t border-gray-200 pt-2 text-center">
                    <p className="text-xs text-gray-500">Thank you for choosing EatWana!</p>
                    <p className="text-xs text-gray-400 mt-1">This is a computer-generated invoice and does not require a signature.</p>
                </div>
            </div>
        </div>
    );
};

export default ViewInvoice;