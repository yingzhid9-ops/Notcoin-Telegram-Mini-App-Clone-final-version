import { useEffect, useState } from 'react';
import './index.css';
import { coin, notcoin } from './images';

const App = () => {
    const [balance, setBalance] = useState(0);
    const [tapCount, setTapCount] = useState(0);
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
        if (tapCount >= 10) {
            setShowAdModal(true);
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setBalance((prev) => parseFloat((prev + 0.05).toFixed(2)));
        setTapCount((prev) => prev + 1);

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
                setTapCount(0);
                setShowAdModal(false);

                (window as any).Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
            })
            .catch(() => {
                alert("请完整观看视频以恢复体力");
            });
    };

    const handleAnimationEnd = (id: number) => {
        setClicks((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium select-none">

            {/* 顶部余额 + coin（这里解决你B方案核心点） */}
            <div className="w-full pt-12 flex flex-col items-center">
                <p className="text-gray-400 text-lg mb-2">当前待提取余额 (USD)</p>

                <div className="text-6xl font-black flex items-center text-[#fad258]">
                    <img src={coin} width={42} className="mr-2" alt="coin" />
                    <span>${balance.toFixed(2)}</span>
                </div>

                <p className="mt-4 text-sm bg-white/10 px-4 py-1 rounded-full text-[#fad258]">
                    满 $100.00 即可提现至 TON 钱包
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
                        alt="coin"
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
                            +$0.05
                        </div>
                    ))}
                </div>
            </div>

            {/* 体力条 */}
            <div className="w-full pb-12 px-8">
                <div className="flex justify-between mb-2 text-sm">
                    <span>挖矿体力值</span>
                    <span className={tapCount >= 10 ? "text-red-500 animate-pulse" : ""}>
                        {10 - tapCount} / 10 次点击
                    </span>
                </div>

                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div
                        className="bg-[#fad258] h-full transition-all duration-300"
                        style={{ width: `${((10 - tapCount) / 10) * 100}%` }}
                    />
                </div>
            </div>

            {/* 提现按钮 */}
            <button
                onClick={() =>
                    alert(`余额不足 $100.00，还差 $${(100 - balance).toFixed(2)}`)
                }
                className="w-full mb-8 bg-[#fad258] text-black font-extrabold py-4 rounded-2xl text-xl shadow-lg active:scale-95 transition-transform"
            >
                立即提现 (Withdraw)
            </button>

            {/* 广告弹窗 */}
            {showAdModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-6">
                    <div className="bg-[#1f1f1f] border-2 border-[#fad258] p-8 rounded-3xl text-center w-full max-w-sm">
                        <div className="text-6xl mb-4">🪫</div>
                        <h2 className="text-2xl font-bold mb-2">体力已耗尽！</h2>
                        <p className="text-gray-400 mb-8 text-sm">
                            观看广告即可恢复体力
                        </p>

                        <button
                            onClick={handleWatchAd}
                            className="w-full bg-[#fad258] text-black font-black py-5 rounded-2xl text-xl animate-bounce"
                        >
                            📺 观看广告恢复
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
