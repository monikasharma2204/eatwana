import React from 'react';
import { Heart, Clock, Users, Award, Leaf, Truck } from 'lucide-react';

const AboutSection = () => {
    return (
        <section id='about' className="py-16 px-4 md:py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-third mb-4">
                        About Us
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Bringing homely, nutritious meals to students and working professionals
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    {/* Left - Image */}
                    <div className="order-2 md:order-1">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-third/20">
                            <img
                                src="/picture/AboutImage.png"
                                alt="Fresh healthy meals prepared in our kitchen"
                                className="w-full h-[400px] md:h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-third/40 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                    <p className="text-third font-semibold text-lg">
                                        Serving 50+ Happy Customers Daily
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Content */}
                    <div className="order-1 md:order-2 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-bold text-third">
                                Your Home Away From Home
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                We started with a simple mission: to provide students and working professionals with nutritious, homely meals that remind them of home-cooked food. We understand the challenges of managing time, budget, and health when you're focused on your studies or career.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Our cloud kitchen operates with the highest standards of hygiene and quality. Every meal is prepared fresh daily by experienced chefs who treat food preparation as an art. We source ingredients locally, ensuring freshness and supporting our community.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Whether you need a wholesome tiffin service delivered daily or want to order a special meal from our restaurant menu, we've got you covered. We believe good food shouldn't break the bank, which is why our pricing is designed to be affordable without compromising on quality.
                            </p>
                        </div>

                        {/* Call to Action */}
                        <div className="pt-4">
                            <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                                Explore Our Menu
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feature Highlights */}
                {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                    <FeatureCard
                        icon={<Heart className="w-8 h-8" />}
                        title="Healthy & Hygienic"
                        description="Prepared in sanitized kitchens with fresh ingredients and nutritional balance in mind"
                    />
                    <FeatureCard
                        icon={<Users className="w-8 h-8" />}
                        title="Student Friendly"
                        description="Affordable meal plans designed for student budgets without compromising on taste or nutrition"
                    />
                    <FeatureCard
                        icon={<Award className="w-8 h-8" />}
                        title="Expert Chefs"
                        description="Our experienced culinary team brings authentic homestyle cooking to every dish"
                    />
                    <FeatureCard
                        icon={<Truck className="w-8 h-8" />}
                        title="Fast Delivery"
                        description="Hot meals delivered on time, every time. We value your schedule as much as you do"
                    />
                    <FeatureCard
                        icon={<Leaf className="w-8 h-8" />}
                        title="Daily Fresh Meals"
                        description="No preservatives, no frozen food. Everything is cooked fresh daily from scratch"
                    />
                    <FeatureCard
                        icon={<Clock className="w-8 h-8" />}
                        title="Flexible Plans"
                        description="Choose from daily tiffin subscriptions or order à la carte based on your needs"
                    />
                </div> */}

                {/* Stats Section */}
                <div className="mt-20 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 shadow-2xl">
                    <div className="grid sm:grid-cols-3 gap-8 text-center text-white">
                        <div>
                            <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                            <div className="text-white/90 text-lg">Daily Customers</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                            <div className="text-white/90 text-lg">Meals Delivered</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold mb-2">4.8★</div>
                            <div className="text-white/90 text-lg">Customer Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-third/10 hover:shadow-2xl hover:border-third/30 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4 text-white">
                {icon}
            </div>
            <h4 className="text-xl font-bold text-third mb-2">{title}</h4>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
};

export default AboutSection;