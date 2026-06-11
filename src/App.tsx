import { useEffect, useState } from 'react';
import './index.css';
import { notcoin } from './images';

const App = () => {
    const [balance, setBalance] = useState(0);
    const [showAdModal, setShowAdModal] = useState(false);
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

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
        setBalance((prev) => parseFloat((prev + 50).toFixed(0)));

        setClicks((prev) => [
            ...prev,
            { id: Date.now(), x, y },
        ]);
    };

    const handleWatchAd = () => {
        const Adsgram = (window as any).Adsgram;

        if (!Adsgram) {
            alert('Adsgram 未加载');
            return;
        }

        const AdController = Adsgram.init({
            blockId: "34833",
        });

        AdController.show()
            .then(() => {
                setShowAdModal(false);

                (window as any).Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
            })
            .catch(() => {
                alert("Watch a short fragment to recalibrate your node energy.");
            });
    };

    const handleAnimationEnd = (id: number) => {
        setClicks((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium select-none">

            {/* 顶部信息 */}
            <div className="w-full pt-12 flex flex-col items-center">
                <p className="text-gray-400 text-lg mb-2">
                    Airdrop Threshold: 100,000 VTX
                </p>

                <div className="text-6xl font-black flex items-center text-[#fad258]">
                    <span className="mr-2">⚡</span>
                    <span>{balance} VTX</span>
                </div>

                <p className="mt-4 text-sm bg-white/10 px-4 py-1 rounded-full text-[#fad258]">
                    Status: Calculating contribution...
                </p>
            </div>

            {/* 点击区域 */}
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

            {/* 状态条（替代体力系统） */}
            <div className="w-full pb-12 px-8">
                <div className="flex justify-between mb-2 text-sm">
                    <span>Node Stability</span>
                    <span className="text-[#fad258]">100%</span>
                </div>

                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div
                        className="bg-[#fad258] h-full transition-all duration-300"
                        style={{ width: `100%` }}
                    />
                </div>
            </div>

            {/* 主按钮 */}
            <button
                onClick={() => setShowAdModal(true)}
                className="w-full mb-8 bg-[#fad258] text-black font-extrabold py-4 rounded-2xl text-xl active:scale-95 transition-transform"
            >
                Boost Mining Speed (Node Optimization)
            </button>

            {/* 弹窗 */}
            {showAdModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-6">
                    <div className="bg-[#1f1f1f] border-2 border-[#fad258] p-8 rounded-3xl text-center w-full max-w-sm">
                        <div className="text-6xl mb-4">🧠</div>

                        <h2 className="text-2xl font-bold mb-2">
                            Node Recalibration Required
                        </h2>

                        <p className="text-gray-400 mb-8 text-sm">
                            Watch a short fragment to recalibrate your node energy.
                        </p>

                        <button
                            onClick={handleWatchAd}
                            className="w-full bg-[#fad258] text-black font-black py-5 rounded-2xl text-xl animate-bounce"
                        >
                            ▶ Start Calibration
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
