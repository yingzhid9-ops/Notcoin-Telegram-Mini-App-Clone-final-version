import { useEffect, useState } from 'react';
import './index.css';
import { notcoin } from './images';

const App = () => {
    const [balance, setBalance] = useState(0);
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
    const [stability, setStability] = useState(100);
    const [showAdModal, setShowAdModal] = useState(false);

    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
        }
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (stability <= 0) {
            setShowAdModal(true);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setBalance((prev) => prev + 50);
        setStability((prev) => Math.max(prev - 10, 0));

        setClicks((prev) => [...prev, { id: Date.now(), x, y }]);
    };

    const handleAnimationEnd = (id: number) => {
        setClicks((prev) => prev.filter((c) => c.id !== id));
    };

    const handleRecover = () => {
        setStability(100);
        setShowAdModal(false);
    };

    return (
        <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium select-none">

            {/* Header */}
            <div className="w-full pt-12 flex flex-col items-center">
                <p className="text-gray-200 text-lg mb-2 font-medium">
                    Airdrop Threshold: 100,000 VTX
                </p>

                <div className="text-6xl font-black flex items-center drop-shadow-md">
                    <span className="mr-2 text-white">⚡</span>

                    <span className="text-white font-extrabold tracking-wide">
                        {balance}
                        <span className="text-[#ffd36a] ml-2">VTX</span>
                    </span>
                </div>

                <p className="mt-4 text-sm bg-white/10 px-4 py-1 rounded-full text-white/90 font-medium">
                    Status: Calculating contribution...
                </p>
            </div>

            {/* Mining Area */}
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
                        className="drop-shadow-[0_0_50px_rgba(255,211,106,0.25)]"
                    />

                    {clicks.map((click) => (
                        <div
                            key={click.id}
                            className="absolute text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,211,106,0.8)] pointer-events-none"
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

            {/* Node Stability */}
            <div className="w-full pb-12 px-8">
                <div className="flex justify-between mb-2 text-sm">
                    <span className="text-gray-200">Node Stability</span>
                    <span className="text-white font-bold">
                        {stability}%
                    </span>
                </div>

                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div
                        className="bg-[#ffd36a] h-full transition-all duration-300"
                        style={{ width: `${stability}%` }}
                    />
                </div>
            </div>

            {/* Modal */}
            {showAdModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-6">
                    <div className="bg-[#1f1f1f] border border-[#ffd36a] p-8 rounded-3xl text-center w-full max-w-sm">

                        <div className="text-6xl mb-4">🧠</div>

                        <h2 className="text-2xl font-bold mb-2 text-white">
                            Node Energy Depleted
                        </h2>

                        <p className="text-white/70 mb-8 text-sm leading-relaxed">
                            Watch a short fragment to recalibrate your node energy.
                        </p>

                        <button
                            onClick={handleRecover}
                            className="w-full bg-[#ffd36a] text-black font-black py-5 rounded-2xl text-xl active:scale-95 transition-transform"
                        >
                            Start Calibration
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
