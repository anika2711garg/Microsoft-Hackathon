import { Users, Globe, Shield, AlertTriangle, Handshake } from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="text-center py-16 bg-blue-600">
                <h1 className="text-5xl font-extrabold">About Us 🌍</h1>
                <p className="text-lg text-gray-200 mt-4">
                    Dedicated to ensuring safety, disaster preparedness, and rapid response.
                </p>
            </header>

            {/* Mission Section */}
            <section className="container mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
                <p className="text-lg text-center text-gray-300 max-w-3xl mx-auto">
                    We strive to build a robust disaster management system that enables real-time 
                    alerts, facilitates emergency response, and ensures community safety through 
                    proactive measures and technology.
                </p>
            </section>

            {/* Core Values Section */}
            <section className="bg-gray-800 py-12">
                <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                    <div className="bg-gray-700 p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
                        <Shield size={40} className="text-green-400 mx-auto" />
                        <h3 className="text-xl font-semibold mt-4">Safety First</h3>
                        <p className="text-gray-400 mt-2">Ensuring the well-being of people in disaster situations.</p>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
                        <AlertTriangle size={40} className="text-yellow-400 mx-auto" />
                        <h3 className="text-xl font-semibold mt-4">Quick Response</h3>
                        <p className="text-gray-400 mt-2">Providing real-time alerts to minimize risks.</p>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
                        <Handshake size={40} className="text-blue-400 mx-auto" />
                        <h3 className="text-xl font-semibold mt-4">Community Support</h3>
                        <p className="text-gray-400 mt-2">Encouraging community-driven disaster response.</p>
                    </div>
                </div>
            </section>

            {/* Meet the Team Section (Optional) */}
            <section className="container mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
                        <Users size={40} className="text-purple-400 mx-auto" />
                        <h3 className="text-xl font-semibold mt-4">John Doe</h3>
                        <p className="text-gray-400 mt-2">Founder & Emergency Expert</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
                        <Globe size={40} className="text-red-400 mx-auto" />
                        <h3 className="text-xl font-semibold mt-4">Jane Smith</h3>
                        <p className="text-gray-400 mt-2">Disaster Response Coordinator</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
                        <Shield size={40} className="text-green-400 mx-auto" />
                        <h3 className="text-xl font-semibold mt-4">Michael Lee</h3>
                        <p className="text-gray-400 mt-2">Safety & Rescue Specialist</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600 py-12 text-center">
                <h2 className="text-3xl font-bold">Join Our Cause</h2>
                <p className="text-lg text-gray-200 mt-2">Be part of a proactive disaster management system.</p>
                <button className="mt-6 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition">
                    Get Involved
                </button>
            </section>

            {/* Footer */}
            <footer className="text-center py-6 bg-gray-900 text-gray-400">
                <p>&copy; {new Date().getFullYear()} Disaster Management System | All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default About;
