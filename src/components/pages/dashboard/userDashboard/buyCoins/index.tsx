"use client";
import GlassWrapper from '@/components/molecules/GlassWrapper';
import { useAppDispatch } from '@/hooks/hook';
import GoldCoinIcon from '@/icons/GoldCoinIcon';
import SilverCoinIcon from '@/icons/SilverCoinIcon';
import { openPasswordDialog } from '@/slice/updatePasswordSlice';
import { GameResponseProps } from '@/types/game';
import { Coin } from '@wandersonalwes/iconsax-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BuyCoinGameListPage({
    games,
    coins,
}: {
    games: GameResponseProps
    coins: any
}) {
    const gameInfo = coins?.data?.game_information || {}
    const dispatch = useAppDispatch();

    console.log("coins", coins);
    return (
        <section className="buy__coin__root">
            <div className="section__title mb-4 lg:mb-8 max-w-[520px]">
                <h1 className="mb-2 text-[24px] lg:text-[32px]">Buy Coins</h1>
                <p className="text-[11px] lg:text-[13px]">
                    To start playing and cashing out your winnings, you’ll need a crypto wallet to purchase E-Credits and receive payouts. Don't worry—it’s quick and easy!
                </p>
            </div>

            <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {games.data?.data.map((game) => {
                    const info = gameInfo[game.provider.toLowerCase()] || { balance: 0, type: 'sc' }
                    const CoinIcon = info.type === 'gc' ? GoldCoinIcon : SilverCoinIcon
                    return (
                        <div key={game.id} className={`col-span-1 ${info.type === 'gc' ? "hidden" : ""}`}>
                            <GlassWrapper
                                className="coin__card px-6 py-4"
                            >
                                <div className="coin__detail">
                                    <div className="flex gap-4 items-center mb-4">
                                        <Image
                                            src={game.thumbnail || '/assets/images/fallback.png'}
                                            alt={game.name}
                                            width={72}
                                            height={72}
                                            className="rounded-full aspect-square"
                                        />
                                        <div className="game-content">
                                            <strong className="text-[16px] text-white block mb-2">{game?.name}</strong>
                                            <ul className="flex gap-4">
                                                <li className="flex gap-1 items-center">
                                                    <CoinIcon />
                                                    <span className="text-[12px] font-[600]">{info.balance}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`buy-coins/${game.id}`}
                                    className="ss-btn bg-primary-grad !text-white flex justify-center gap-1"
                                    onClick={(e) => {
                                        if (info?.has_changed_password) {
                                            e.preventDefault();
                                            dispatch(openPasswordDialog({
                                                provider: game?.name,
                                            }));
                                        }
                                    }}
                                >
                                    <Coin />  Buy Coins
                                </Link>
                            </GlassWrapper>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
