'use client';

import ButtonDark from "@/components/ButtonDark";
import ButtonLight from "@/components/ButtonLight";
import RadioButton from "@/components/RadioButton";
import Link from "next/link";
import Image from "next/image";
import { ArrowBack } from "@mui/icons-material";

const page = () => {
    return (
        <div className="pt-20">
            <RadioButton options={[
                {
                    label: "10",
                    value: "10",
                },
                {
                    label: "14",
                    value: "14",
                },
                {
                    label: "16",
                    value: "16",
                },
            ]} />
        </div>
    );
};

export default page;