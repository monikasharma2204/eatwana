import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function QRCodeGenerator({ upiId, name, amount, note }) {
    const [copied, setCopied] = useState(false);

    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
        name
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    const generateQRUrl = (text) => {
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
            text
        )}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-xl border-2 border-primary/20 flex flex-col space-y-4 items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
                {/* QR Code Display */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4 mb-6 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-inner">
                        <img
                            src={generateQRUrl(upiUrl)}
                            alt="QR Code"
                            className="w-48 h-48"
                        />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-center text-third text-sm mb-4">
                    Scan QR Code to Pay
                </h2>

                {/* Copy UPI URL */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 mb-6 flex items-center justify-between gap-3">
                    <input
                        type="text"
                        value={upiId}
                        readOnly
                        className="bg-transparent flex-1 text-teal-700 font-mono text-sm outline-none"
                    />
                    <button
                        onClick={handleCopy}
                        className="text-teal-600 hover:text-teal-700 transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                </div>
            </div>

            <p className="text-center text-gray-500 text-sm">
                Open any UPI app and scan the QR code to complete payment
            </p>
        </div>
    );
}
