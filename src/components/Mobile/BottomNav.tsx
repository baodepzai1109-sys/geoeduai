"use client";

import {

House,

Search,

CirclePlus,

Heart,

User

} from "lucide-react";

export default function BottomNav(){

return(

<footer

className="

fixed

bottom-0

left-0

right-0

h-16

bg-white

border-t

flex

justify-around

items-center

"

>

<House/>

<Search/>

<CirclePlus/>

<Heart/>

<User/>

</footer>

)

}