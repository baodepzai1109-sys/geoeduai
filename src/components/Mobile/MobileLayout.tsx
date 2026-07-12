interface Props{
    children:React.ReactNode;
}

export default function MobileLayout({
    children
}:Props){

    return(

        <div className="min-h-screen bg-[#F0F2F5]">

            {children}

        </div>

    )

}