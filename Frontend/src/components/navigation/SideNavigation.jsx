import {House, Sparkles, Star} from "lucide-react";
import {NavigationItems} from "../../constants/NavigationItems.jsx";

export const SideNavigation = ({setActiveTab}) => {
    return (
        <div className="bg-gradient-to-br bg-[#111415]/95 rounded-xl p-6 shadow-2xl border border-[#beb8ab]-700">
            <div className="grid grid-rows-2">
                {NavigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button className="row-span-1 inline-flex items-center gap-2"
                            onClick={() => setActiveTab(item.id)}>

                            <Icon />
                            {item.label}
                        </button>
                    )})}
            </div>
        </div>
    )
}