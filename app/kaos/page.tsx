import React from "react";
import Header from "@/components/Header";

const page = () => {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="flex items-center justify-center h-[60vh]">
                <h1 className="text-4xl font-bold text-gray-200 uppercase tracking-widest">Main Content Area</h1>
            </div>
        </main>

    )
}

export default page