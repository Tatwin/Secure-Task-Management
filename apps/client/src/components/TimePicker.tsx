import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimePickerProps {
    value: Date;
    onChange: (date: Date) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
    const [hours, setHours] = useState(value.getHours() % 12 || 12);
    const [minutes, setMinutes] = useState(value.getMinutes());
    const [isPM, setIsPM] = useState(value.getHours() >= 12);
    const [view, setView] = useState<"hours" | "minutes">("hours");
    const [typedTime, setTypedTime] = useState(
        `${(value.getHours() % 12 || 12).toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
    );

    const lastValueRef = useRef(value);

    // Sync from props
    useEffect(() => {
        if (value.getTime() !== lastValueRef.current.getTime()) {
            const h = value.getHours() % 12 || 12;
            const m = value.getMinutes();
            setHours(h);
            setMinutes(m);
            setIsPM(value.getHours() >= 12);
            setTypedTime(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
            lastValueRef.current = value;
        }
    }, [value]);

    const handleUpdate = (h: number, m: number, pm: boolean) => {
        let finalM = (m + 60) % 60;
        let finalH = h;

        if (finalH > 12) finalH = 1;
        if (finalH < 1) finalH = 12;

        const newDate = new Date(value);
        let militaryH = pm ? (finalH % 12) + 12 : finalH % 12;
        newDate.setHours(militaryH);
        newDate.setMinutes(finalM);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);

        setHours(finalH);
        setMinutes(finalM);
        setIsPM(pm);
        setTypedTime(`${finalH.toString().padStart(2, '0')}:${finalM.toString().padStart(2, '0')}`);

        lastValueRef.current = newDate;
        onChange(newDate);
    };

    const handleTypedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTypedTime(val);

        const match = val.match(/^(\d{1,2}):(\d{1,2})$/);
        if (match) {
            let h = parseInt(match[1]);
            let m = parseInt(match[2]);
            if (h >= 13) h = h % 12 || 12;
            if (m >= 60) m = m % 60;
            handleUpdate(h, m, isPM);
        }
    };

    const hourNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const majorMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    return (
        <div className="flex flex-col items-center gap-5 w-full max-w-[260px]">
            {/* AM/PM Switch */}
            <div className="flex w-full bg-[var(--color-surface)] p-1 rounded-2xl border border-[var(--color-border)] shadow-sm">
                <button
                    type="button"
                    onClick={() => handleUpdate(hours, minutes, false)}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${!isPM ? 'bg-[var(--color-primary)] text-white shadow-md' : 'opacity-40 hover:opacity-100'}`}
                >
                    AM
                </button>
                <button
                    type="button"
                    onClick={() => handleUpdate(hours, minutes, true)}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${isPM ? 'bg-[var(--color-primary)] text-white shadow-md' : 'opacity-40 hover:opacity-100'}`}
                >
                    PM
                </button>
            </div>

            {/* Time Display & Manual Entry */}
            <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setView("hours")}
                        className={`text-4xl font-black transition-all ${view === 'hours' ? 'text-[var(--color-primary)]' : 'opacity-20 hover:opacity-40'}`}
                    >
                        {hours.toString().padStart(2, '0')}
                    </button>
                    <span className="text-2xl font-black opacity-10">:</span>
                    <button
                        type="button"
                        onClick={() => setView("minutes")}
                        className={`text-4xl font-black transition-all ${view === 'minutes' ? 'text-[var(--color-primary)]' : 'opacity-20 hover:opacity-40'}`}
                    >
                        {minutes.toString().padStart(2, '0')}
                    </button>
                </div>
                <input
                    type="text"
                    value={typedTime}
                    onChange={handleTypedTimeChange}
                    className="w-24 h-8 bg-transparent border-b-2 border-[var(--color-border)] focus:border-[var(--color-primary)] transition-all text-center text-xs font-black outline-none opacity-40 focus:opacity-100"
                    placeholder="HH:MM"
                />
            </div>

            {/* Interactive Clock UI */}
            <div
                className="relative w-44 h-44 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-inner flex items-center justify-center cursor-crosshair group"
                onMouseDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    const handleMove = (moveEvent: MouseEvent) => {
                        const x = moveEvent.clientX - centerX;
                        const y = moveEvent.clientY - centerY;
                        let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
                        if (angle < 0) angle += 360;

                        if (view === "hours") {
                            let h = Math.round(angle / 30);
                            if (h === 0) h = 12;
                            handleUpdate(h, minutes, isPM);
                        } else {
                            let m = Math.round(angle / 6) % 60;
                            handleUpdate(hours, m, isPM);
                        }
                    };

                    const handleUp = () => {
                        window.removeEventListener('mousemove', handleMove);
                        window.removeEventListener('mouseup', handleUp);
                        if (view === "hours") setView("minutes");
                    };

                    window.addEventListener('mousemove', handleMove);
                    window.addEventListener('mouseup', handleUp);
                }}
            >
                <div className="absolute w-2 h-2 rounded-full bg-[var(--color-primary)] z-20 shadow-sm" />

                {/* Hand */}
                <motion.div
                    className="absolute bottom-1/2 w-1 origin-bottom rounded-full pointer-events-none"
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        height: view === 'hours' ? '35%' : '45%',
                        rotate: view === 'hours' ? (hours % 12) * 30 : minutes * 6
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />

                {/* Markers */}
                <div className="absolute inset-0 p-3 pointer-events-none">
                    {(view === "hours" ? hourNumbers : majorMinutes).map((num, i) => {
                        const rotation = i * 30;
                        const active = view === "hours" ? hours % 12 === num % 12 : minutes === num;
                        return (
                            <div
                                key={num}
                                className={`absolute w-6 h-6 -ml-3 -mt-3 text-[9px] font-black flex items-center justify-center transition-all ${active ? 'text-[var(--color-primary)] scale-110' : 'opacity-20'}`}
                                style={{
                                    left: `${50 + 42 * Math.sin((rotation * Math.PI) / 180)}%`,
                                    top: `${50 - 42 * Math.cos((rotation * Math.PI) / 180)}%`,
                                }}
                            >
                                {num}
                            </div>
                        );
                    })}
                </div>
            </div>

            <p className="text-[8px] font-black uppercase tracking-widest opacity-20">Drag clock to select {view}</p>
        </div>
    );
};
