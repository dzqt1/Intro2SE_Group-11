import { Button } from "@/components/ui/button"

export default function DemoPage(){
    return(
        <>
            <div className="p-4 bg-emerald-50 justify-center items-center flex flex-col w-full h-full">
                <p className="text-5xl font-bold mb-4">Demo Page</p>
                <Button className="bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 w-50">
                    Click Me
                </Button>
            </div>
        </>
    )
}