import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Send, MapPin } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        const { name, email, mobile, message } = formData;
        console.log(formData);
        // Validation - block submit if ANY field is empty
        if (!name || !email || !mobile || !message) {
            showSnackbar("Please fill in all fields", "warning");
            return;
        }

        try {
            const response = await axiosClient.post("/api/v1/enquiry/add", formData);

            showSnackbar("Enquiry Submitted Successfully", "success");

            // Clear form
            setFormData({
                name: "",
                email: "",
                mobile: "",
                message: ""
            });

        } catch (error) {
            console.log(error);
            showSnackbar("Something went wrong", "error");
        }
    };


    const contactDetails = [
        {
            icon: Phone,
            label: 'Mobile Number',
            value: '+91 97082 77467',
            href: 'tel:+919708277467'
        },
        {
            icon: Mail,
            label: 'Email ID',
            value: 'eatwana@gmail.com',
            href: 'mailto:eatwana@gmail.com'
        },
        {
            icon: MessageCircle,
            label: 'WhatsApp',
            value: '+91 97082 77467',
            href: 'https://wa.me/919708277467'
        }
    ];

    return (
        <>
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
                onClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }}
            />
            <section id='contact' className="py-16 px-4 lg:px-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 animate-fadeIn">
                        <h2 className="text-4xl md:text-5xl font-bold text-third mb-4">
                            Contact Us
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We're here to help you 24/7 for orders, queries, and support.
                        </p>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Contact Form */}
                        <div className="animate-slideUp h-full flex flex-col">
                            <div className="bg-white flex-1 rounded-xl shadow-lg border border-third/20 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
                                <h3 className="text-2xl font-semibold text-third mb-6">
                                    Send us a Message
                                </h3>
                                <div className="space-y-4">
                                    {/* Name Input */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                                            placeholder="Eatwana"
                                        />
                                    </div>

                                    {/* Email Input */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                                            placeholder="eatwana@gmail.com"
                                        />
                                    </div>

                                    {/* Phone Input */}
                                    <div>
                                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="mobile"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                                            placeholder="+91 1234567890"
                                        />
                                    </div>

                                    {/* Message Textarea */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none resize-none"
                                            placeholder="Tell us how we can help you..."
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmit}
                                        className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <span>Send Message</span>
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="animate-slideUp h-full flex flex-col">
                            <div className="bg-white flex-1 rounded-xl shadow-lg border border-third/20 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
                                <h3 className="text-2xl font-semibold text-third mb-6">
                                    Get in Touch
                                </h3>
                                <p className="text-gray-600 mb-8">
                                    Reach out to us directly through any of the following channels. Our team is always ready to assist you with your orders and inquiries.
                                </p>

                                {/* Contact Details */}
                                <div className="space-y-5">
                                    {contactDetails.map((detail, index) => (
                                        <a
                                            key={index}
                                            href={detail.href}
                                            target={detail.label === 'WhatsApp' ? '_blank' : '_self'}
                                            rel={detail.label === 'WhatsApp' ? 'noopener noreferrer' : ''}
                                            className="flex items-center gap-4 p-4 rounded-lg border border-third/10 hover:border-secondary hover:bg-secondary/5 hover:scale-105 transition-all duration-300 group"
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <detail.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    {detail.label}
                                                </p>
                                                <p className="text-lg font-semibold text-third group-hover:text-secondary transition-colors duration-300">
                                                    {detail.value}
                                                </p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Info Card */}
                            {/* <div className="bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg p-6 md:p-8 text-white">
                            <h4 className="text-xl font-semibold mb-3">Business Hours</h4>
                            <div className="space-y-2 text-white/90">
                                <p className="flex justify-between">
                                    <span>Monday - Friday:</span>
                                    <span className="font-semibold">9:00 AM - 10:00 PM</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Saturday - Sunday:</span>
                                    <span className="font-semibold">10:00 AM - 11:00 PM</span>
                                </p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/20">
                                <p className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                                    <span>
                                        123 Foodie Street, Gourmet District, Mumbai - 400001, India
                                    </span>
                                </p>
                            </div>
                        </div> */}
                        </div>
                    </div>
                </div>

                <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
      `}</style>
            </section>
        </>
    );
}