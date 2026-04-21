import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface MenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
    return (
        <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className={`absolute top-0 left-0 w-80 h-full bg-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl text-gray-600 font-bold tracking-tight">MENU</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <CloseIcon />
                    </button>
                </div>
                <div className="py-6 px-4">
                    <ul className="space-y-6">
                        <li><a href="#" onClick={onClose} className="text-lg text-gray-600 font-bold hover:underline block text-gray-900">SEPATU</a></li>
                        <li><a href="#" onClick={onClose} className="text-lg text-gray-600 font-bold hover:underline block text-gray-900">PRIA</a></li>
                        <li><a href="#" onClick={onClose} className="text-lg text-gray-600 font-bold hover:underline block text-gray-900">WANITA</a></li>
                        <li><a href="#" onClick={onClose} className="text-lg text-gray-600 font-bold hover:underline block text-gray-900">ANAK</a></li>
                        <li><a href="#" onClick={onClose} className="text-lg text-gray-600 font-bold hover:underline block text-gray-900">OLAHRAGA</a></li>
                        <li><a href="#" onClick={onClose} className="text-lg text-gray-600 font-bold hover:underline block text-gray-900">BRANDS</a></li>
                        <li><a href="#" onClick={onClose} className="text-lg text-gray-600 font-bold hover:underline block text-gray-900">OUTLET</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Menu;