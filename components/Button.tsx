const Button = ({ text }: { text: string }) => {
    return (
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-white text-white font-medium hover:bg-gray-900 hover:text-white transition">
            {text}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
};

export default Button;