import {House, Sparkles, Star} from "lucide-react";

export const SideNavigation = ({setActiveTab}) => {
    return (
        <div className="bg-gradient-to-br bg-[#111415]/95 rounded-xl p-6 shadow-2xl border border-[#beb8ab]-700">
            <div className="grid grid-rows-2">
                <button className="row-span-1 inline-flex items-center gap-2"
                        onClick={() => setActiveTab('landing')}>
                    <Star/>
                    Welcome
                </button>
                <button className="row-span-1 inline-flex items-center gap-2"
                        onClick={() => setActiveTab('future')}>
                    <Sparkles/>
                    Future releases
                </button>
            </div>
        </div>
    )
}