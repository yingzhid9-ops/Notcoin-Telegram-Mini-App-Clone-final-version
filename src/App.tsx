import { useEffect, useState } from 'react';
import './index.css';
import { notcoin } from './images';

const App = () => {
    const [balance, setBalance] = useState(0);
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

    // ⭐ 新增：稳定度（100 → 0）
    const [stability, setStability] = useState(100);

    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
        }
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // +50 VTX
        setBalance((prev) => prev + 50);

        // ⭐ 每次点击减少10%稳定度
        setStability((prev) => Math.max(prev - 10, 0));

        setClicks((prev) => [...prev, { id: Date.now(), x, y }]);
    };

    const handleAnimationEnd = (id: number) => {
        setClicks((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium select-none">

            {/* 顶部 */}
            <div className="w-full pt-12 flex flex-col items-center">
                <p className="text-gray-300 text-lg mb-2">
                    Airdrop Threshold: 100,000 VTX
                </p>

                <div className="text-6xl font-black flex items-center text-[#fad258] drop-shadow-lg">
                    <span className="mr-2">⚡</span>
                    <span>{balance} VTX</span>
                </div>

                <p className="mt-4 text-sm bg-white/10 px-4 py-1 rounded-full text-[#fad258]">
                    Status: Calculating contribution...
                </p>
            </div>

            {/* 点击区 */}
            <div className="flex-grow flex items-center justify-center relative">
                <div
                    className="relative active:scale-95 transition-transform cursor-pointer"
                    onClick={handleClick}
                >
                    <img
                        src={notcoin}
                        width={280}
                        height={280}
                        alt="node"
                        className="drop-shadow-[0_0_50px_rgba(250,210,88,0.3)]"
                    />

                    {clicks.map((click) => (
                        <div
                            key={click.id}
                            className="absolute text-3xl font-bold text-[#fad258] pointer-events-none"
                            style={{
                                top: `${click.y - 50}px`,
                                left: `${click.x - 20}px`,
                                animation: `float 0.8s ease-out forwards`,
                            }}
                            onAnimationEnd={() => handleAnimationEnd(click.id)}
                        >
                            +50
                        </div>
                    ))}
                </div>
            </div>

            {/* ⭐ Node Stability（现在会变化） */}
            <div className="w-full pb-12 px-8">
                <div className="flex justify-between mb-2 text-sm">
                    <span>Node Stability</span>
                    <span className="text-[#fad258] font-semibold">
                        {stability}%
                    </span>
                </div>

                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div
                        className="bg-[#fad258] h-full transition-all duration-300"
                        style={{ width: `${stability}%` }}
                    />
                </div>
            </div>

        </div>
    );
};

export default App;
