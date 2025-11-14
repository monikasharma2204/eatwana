import { useState } from 'react';
import { Clock, Award } from 'lucide-react';




const TiffinMenuTabs = ({ menu }) => {
    const [activeDay, setActiveDay] = useState(0);

    const getMealIcon = (mealType) => {
        return <Clock className="w-4 h-4" />;
    };

    return (
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary mb-6">Weekly Menu</h2>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-third/20">
                <div className="flex overflow-x-auto bg-third/5 border-b border-third/20">
                    {menu?.week?.map((day, idx) => (
                        <button
                            key={day?.day}
                            onClick={() => setActiveDay(idx)}
                            className={`px-6 py-3 font-medium whitespace-nowrap transition-all ${activeDay === idx
                                ? 'bg-primary text-white'
                                : 'text-third hover:bg-third/10'
                                }`}
                        >
                            {day?.day}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {menu?.week?.[activeDay] && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-secondary px-3 py-1 bg-secondary/10 rounded-full">
                                    {menu.menuType}
                                </span>
                                {menu?.week[activeDay].note && (
                                    <span className="text-sm text-third italic flex items-center gap-1">
                                        <Award className="w-4 h-4" />
                                        {menu?.week[activeDay].note}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                {Object.entries(menu?.week[activeDay].meals).map(([mealType, dishes]) => (
                                    <div key={mealType}>
                                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                                            {getMealIcon(mealType)}
                                            {mealType?.charAt(0).toUpperCase() + mealType?.slice(1)}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {dishes?.map((dish, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-third/5 border border-third/20 rounded-full text-sm text-third hover:scale-[1.03] hover:shadow-md transition-all cursor-default flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                    {dish?.name || dish}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TiffinMenuTabs;