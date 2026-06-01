"use client";

import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
    return (
        <div className="hidden lg:flex items-center bg-[#eaebed] px-3 py-1.5 w-[190px] relative transition-all border border-transparent focus-within:border-gray-400">
            <input
                type="text"
                placeholder="Cari"
                className="bg-transparent text-[13px] focus:outline-none w-full placeholder:text-gray-500 font-medium"
            />
            <SearchIcon sx={{ fontSize: 20, color: '#000000' }} />
        </div>
    );
};

export default SearchBar;
