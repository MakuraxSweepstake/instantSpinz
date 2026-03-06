"use client";
import GlassWrapper from '@/components/molecules/GlassWrapper';
import { useAppSelector } from '@/hooks/hook';
import EditIcon from '@/icons/EditIcon';
import { formatDateTime } from '@/utils/formatDateTime';
import Image from 'next/image';
import AgeGate from '../dialog/AgeGate';

export default function UserProfileCard({ balance, loading }: { balance: any; loading?: boolean }) {
    const user = useAppSelector(state => state?.auth.user);
    const { date } = formatDateTime(user?.registered_date as string);

    return (
        <GlassWrapper className="player__info text-center  rounded-xl lg:rounded-3xl p-4 lg:py-10 lg:px-9" >
            <div className="player__profile bg-primary-grad p-[1px] rounded-full max-w-fit mx-auto relative">
                <Image src={user?.profile_image_file || "/assets/images/auth-image.png"} alt='' width={100} height={100} className=' aspect-square rounded-full border-[5px] border-solid border-white' />
                <div className="absolute left-[50%] translate-x-[-50%] bottom-[-10px]">
                    <EditIcon />
                </div>
            </div>
            <h1 className="text-24 lg:text-[32px] text-white my-1">{user?.name}</h1>
            <p className="text-white text-[11px] lg:text-[14px] mt-4">Joined: {date}</p>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {/* Current Balance */}
                    <div className="col-span-1 md:col-span-2 rounded-[14px] p-4 lg:py-6" style={{ background: "rgba(191, 26, 198, 0.10)" }}>
                        <div className="flex justify-center items-center gap-3 animate-pulse">
                            <div className="h-12 w-12 bg-gray-400 rounded-full" />
                            <div className="content mt-3 text-start w-32">
                                <div className="h-4 bg-gray-400 rounded mb-2 w-full"></div>
                                <div className="h-3 bg-gray-400 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>

                    {/* Other Cards */}
                    {/* <div className="col-span-2 flex flex-col sm:flex-row gap-2">
                        {[0, 1, 2].map((_, index) => (
                            <div
                                key={index}
                                className="w-full rounded-[14px] p-4 lg:py-6 flex justify-center sm:block text-left sm:text-center gap-3 animate-pulse"
                                style={{ background: "rgba(191, 26, 198, 0.10)" }}
                            >
                                <div className="h-12 w-12 bg-gray-400 rounded-full sm:mx-auto" />
                                <div className="content mt-3 w-32 sm:w-full">
                                    <div className="h-4 bg-gray-400 rounded mb-2 w-3/4"></div>
                                    <div className="h-3 bg-gray-400 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div> */}
                </div>) :
                (<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    <div className="col-span-1 md:col-span-2  rounded-[14px] p-4 lg:py-6" style={{ background: "rgba(191, 26, 198, 0.10)" }}>
                        <div className="flex justify-center items-center gap-3">
                            <Image src={"/assets/images/current-balance.svg"} alt='' width={48} height={48} />
                            <div className="content mt-3 text-start">
                                <strong className="text-[12px] leading-[120%] font-[700] text-white block ">SC:{balance?.data?.current_balance}</strong>
                                <span className="text-white text-[9px]">Current Balance</span>
                            </div>
                        </div>
                    </div>

                    <AgeGate />
                    {/* <div className="col-span-2 flex flex-col sm:flex-row gap-2">
                        <div className="w-full  rounded-[14px] p-4 lg:py-6 flex justify-center sm:block text-left sm:text-center gap-3" style={{ background: "rgba(191, 26, 198, 0.10)" }}>
                            <Image src={"/assets/images/deposit.svg"} alt='' width={48} height={48} className='sm:mx-auto' />
                            <div className="content mt-3 ">
                                <strong className="text-[12px] leading-[120%] font-[700] text-white block ">${balance?.data?.total_deposited}</strong>
                                <span className="text-white text-[9px]">Total Deposited</span>
                            </div>
                        </div>
                        <div className="w-full  rounded-[14px] p-4 lg:py-6 flex justify-center sm:block text-left sm:text-center gap-3" style={{ background: "rgba(191, 26, 198, 0.10)" }}>
                            <Image src={"/assets/images/withdrawn.svg"} alt='' width={48} height={48} className='sm:mx-auto' />
                            <div className="content mt-3">
                                <strong className="text-[12px] leading-[120%] font-[700] text-white block ">${balance?.data?.total_withdrawn}</strong>
                                <span className="text-white text-[9px]">Total Withdrawal</span>
                            </div>
                        </div>
                        <div className="w-full  rounded-[14px] p-4 lg:py-6 flex justify-center sm:block text-left sm:text-center gap-3" style={{ background: "rgba(191, 26, 198, 0.10)" }}>
                            <Image src={"/assets/images/withdrawn.svg"} alt='' width={48} height={48} className='sm:mx-auto' />
                            <div className="content mt-3">
                                <strong className="text-[12px] leading-[120%] font-[700] text-white block ">${balance?.data?.total_winnings || 0}</strong>
                                <span className="text-white text-[9px]">Total Winnings</span>
                            </div>
                        </div>
                    </div> */}
                </div>)
            }
        </GlassWrapper>
    )
}
