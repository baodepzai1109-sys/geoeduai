"use client";

import { Bell, MessageCircle } from "lucide-react";

export default function MobileHeader(){

    return(

        <header
            className="
fixed
top-0
left-0
right-0
z-50
bg-white
border-b
h-16
flex
items-center
justify-between
px-4
"
        >

            <h1
                className="
text-blue-600
font-black
text-2xl
"
            >
                GeoEduAI
            </h1>

            <div className="flex gap-3">

                <Bell/>

                <MessageCircle/>

            </div>

        </header>

    )

}