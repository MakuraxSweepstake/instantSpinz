// import Avatar from '@/components/atom/Avatar';
// import { Transitions } from '@/components/molecules/Transition';
// import { useAppDispatch, useAppSelector } from '@/hooks/hook';
// import { PATH } from '@/routes/PATH';
// import { clearTokens } from '@/slice/authSlice';
// import { Box, Button, ButtonBase, ClickAwayListener, Fade, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Popper, Stack, Typography } from '@mui/material'
// import Link from 'next/link';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import React, { useRef, useState } from 'react'
// const avataur1 = '/assets/images/avatar-6.png';
// import { ArrowDown2, ArrowUp2, Coin, Logout, MoneySend, Profile, Wallet2 } from "@wandersonalwes/iconsax-react";


// export default function ProfileBlock() {
//     const anchorRef = useRef<any>(null);
//     const [open, setOpen] = useState(false);
//     const handleToggle = () => {
//         setOpen((prevOpen) => !prevOpen);
//     };
//     const pathname = usePathname();
//     const search = useSearchParams();
//     const dispatch = useAppDispatch();
//     const router = useRouter();
//     const user = useAppSelector((state) => state?.auth.user);
//     const handleClose = (event: MouseEvent | TouchEvent) => {
//         if (anchorRef.current && anchorRef.current.contains(event.target)) {
//             return;
//         }
//         setOpen(false);
//     };
//     const id = open ? 'profile-dropdown' : ""

//     React.useEffect(() => {
//         setOpen(false);
//     }, [pathname, search])

//     const handleLogout = (e: React.MouseEvent) => {
//         router.replace(PATH.AUTH.LOGIN.ROOT);
//         e.preventDefault();
//         dispatch(clearTokens());
//     };
//     const menuItems = [
//         {
//             label: "Profile",
//             href: "/account",
//             icon: <Profile size="20" className="group-hover:text-primary" />,
//         },
//         {
//             label: "Game Credentials",
//             href: "/credentials",
//             icon: <Wallet2 size="20" className="group-hover:text-primary" />,
//         },
//         {
//             label: "Deposit History",
//             href: "/account?page=deposit-history",
//             icon: <Coin size="20" className="group-hover:text-primary" />,
//         },
//         {
//             label: "Withdraw History",
//             href: "/account?page=withdrawl-history",
//             icon: <MoneySend size="20" className="group-hover:text-primary" />,
//         },
//         {
//             label: "Logout",
//             href: "#",
//             icon: <Logout size="20" className="group-hover:text-primary" />,
//             onClick: handleLogout,
//         },
//     ];

//     const adminMenuItems = [
//         {
//             label: 'Dashboard',
//             href: '#',
//             icon: <Profile size="20" className="group-hover:text-primary" />,
//         },
//         {
//             label: 'Logout',
//             href: '#',
//             icon: <Logout size="20" className="group-hover:text-primary text-red-500" />,
//             onClick: handleLogout,
//         },
//     ];

//     const [glassStyle, setGlassStyle] = React.useState({ top: 0, height: 0, opacity: 0 });
//     const menuListRef = React.useRef<HTMLUListElement>(null);

//     const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
//         const item = e.currentTarget;
//         const list = menuListRef.current;

//         if (item && list) {
//             const itemRect = item.getBoundingClientRect();
//             const listRect = list.getBoundingClientRect();
//             const topPosition = itemRect.top - listRect.top;

//             setGlassStyle({
//                 top: topPosition,
//                 height: itemRect.height,
//                 opacity: 1,
//             });
//         }
//     };

//     const handleMouseLeave = () => {
//         setGlassStyle((prev) => ({ ...prev, opacity: 0 }));
//     };
//     return (
//         <Box >
//             <a
//                 aria-label="open profile"
//                 ref={anchorRef}
//                 aria-controls={open ? 'profile-grow' : undefined}
//                 aria-haspopup="true"
//                 onClick={handleToggle}
//                 className='!hover:bg-transparent cursor-pointer'
//                 style={{
//                     padding: 0
//                 }}
//             >
//                 <div className=' lg:flex items-center gap-1'>
//                     <Avatar alt="profile user" src={avataur1} />
//                     {user?.role && user.role.toLowerCase() !== "user" ? <>
//                         <div className=' hidden lg:block'>
//                             <strong className='text-[14px] leading-[120%] font-bold text-text-title block mb-1 text-nowrap'>{user?.name}</strong>
//                             <p className='text-[12px] text-left leading-[120%] font-[500] text-para-light text-nowrap'>
//                                 {user?.role || "User"}
//                             </p>
//                         </div>
//                         <ArrowDown2 size={14} className='text-primary hidden lg:block' />
//                     </> : ""}
//                 </div>
//             </a>
//             <Popper
//                 id={id}
//                 open={open}
//                 anchorEl={anchorRef.current}
//                 placement="bottom-end"
//                 transition
//                 style={{ zIndex: 1300 }}
//             >
//                 {({ TransitionProps }) => (
//                     <Fade {...TransitionProps} timeout={300}>
//                         <Paper
//                             elevation={3}
//                             sx={{
//                                 width: 215,
//                                 borderRadius: 2,
//                                 mt: 1,
//                             }}
//                         >
//                             <ClickAwayListener onClickAway={handleClose}>
//                                 {
//                                     user?.role && user.role.toLowerCase() !== "user" ? (
//                                         <List ref={menuListRef}
//                                             onMouseLeave={handleMouseLeave}
//                                             style={{ position: 'relative' }}>
//                                             <div
//                                                 style={{
//                                                     position: "absolute",
//                                                     left: "0",
//                                                     right: "0",
//                                                     top: `${glassStyle.top}px`,
//                                                     height: `${glassStyle.height}px`,
//                                                     background: "rgba(255, 255, 255, 0.15)",
//                                                     backdropFilter: "blur(12px)",
//                                                     WebkitBackdropFilter: "blur(12px)",
//                                                     border: "1px solid rgba(255, 255, 255, 0.25)",
//                                                     borderRadius: "8px",
//                                                     boxShadow: `
//                                 0 8px 32px 0 #ddd,
//                                 inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
//                                 0 0 20px rgba(255, 255, 255, 0.1)
//                             `,
//                                                     transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
//                                                     pointerEvents: "none",
//                                                     zIndex: 1,
//                                                     opacity: glassStyle.opacity,
//                                                     transform:
//                                                         glassStyle.opacity === 1
//                                                             ? "translateY(0) scale(1)"
//                                                             : "translateY(0) scale(0.95)",
//                                                 }}
//                                             />
//                                             {adminMenuItems.map((item, idx) => (
//                                                 <ListItem key={idx} disablePadding onMouseEnter={handleMouseEnter}
//                                                     style={{
//                                                         position: 'relative',
//                                                         zIndex: 2,
//                                                         padding: 0,
//                                                     }}>

//                                                     {!item?.onClick ? <Link
//                                                         href={item.href || ""}

//                                                         className={`flex items-center py-3 px-4 `}
//                                                     >
//                                                         <ListItemIcon className="min-w-[30px] mr-1 group-hover:text-primary">{item.icon}</ListItemIcon>
//                                                         <ListItemText primary={item.label} className='group-hover:text-primary' />
//                                                     </Link> : <ListItemButton
//                                                         href={item.href || ""}
//                                                         onClick={item.onClick}
//                                                         className={`flex items-center py-3 px-4 !wit`}
//                                                     >
//                                                         <ListItemIcon className="min-w-[30px] mr-1 group-hover:text-primary">{item.icon}</ListItemIcon>
//                                                         <ListItemText primary={item.label} className='group-hover:text-primary' />
//                                                     </ListItemButton>}
//                                                 </ListItem>))}
//                                         </List>
//                                     ) : (
//                                         <List ref={menuListRef}
//                                             onMouseLeave={handleMouseLeave}
//                                             style={{ position: 'relative' }}>
//                                             <div
//                                                 style={{
//                                                     position: 'absolute',
//                                                     left: '0',
//                                                     right: '0',
//                                                     top: `${glassStyle.top}px`,
//                                                     height: `${glassStyle.height}px`,
//                                                     background: 'rgba(255, 255, 255, 0.15)',
//                                                     backdropFilter: 'blur(12px)',
//                                                     WebkitBackdropFilter: 'blur(12px)',
//                                                     border: '1px solid rgba(255, 255, 255, 0.25)',
//                                                     borderRadius: '8px',
//                                                     boxShadow: `
//                         0 8px 32px 0 rgba(0, 0, 0, 0.37),
//                         inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
//                         0 0 20px rgba(255, 255, 255, 0.1)
//                     `,
//                                                     transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
//                                                     pointerEvents: 'none',
//                                                     zIndex: 1,
//                                                     opacity: glassStyle.opacity,
//                                                     transform: glassStyle.opacity === 1 ? 'translateY(0) scale(1)' : 'translateY(0) scale(0.95)',
//                                                 }}
//                                             />
//                                             {menuItems.map((item, idx) => (
//                                                 <ListItem key={idx} disablePadding onMouseEnter={handleMouseEnter}
//                                                     style={{
//                                                         position: 'relative',
//                                                         zIndex: 2,
//                                                         padding: 0,
//                                                     }}>
//                                                     {!item?.onClick ?
//                                                         <Link
//                                                             href={item.href || ""}
//                                                             className={`flex items-center py-3 px-4 `}
//                                                         >
//                                                             <ListItemIcon className="min-w-[30px] mr-1 group-hover:text-primary">{item.icon}</ListItemIcon>
//                                                             <ListItemText primary={item.label} className='group-hover:text-primary' />
//                                                         </Link> :
//                                                         <ListItemButton
//                                                             href={item.href || ""}
//                                                             onClick={item.onClick}
//                                                             className={`flex items-center py-3 px-4 !wit`}
//                                                         >
//                                                             <ListItemIcon className="min-w-[30px] mr-1 group-hover:text-primary">{item.icon}</ListItemIcon>
//                                                             <ListItemText primary={item.label} className='group-hover:text-primary' />
//                                                         </ListItemButton>}
//                                                 </ListItem>
//                                             ))}
//                                         </List>
//                                     )
//                                 }

//                             </ClickAwayListener>
//                         </Paper>
//                     </Fade>
//                 )}
//             </Popper>
//         </Box>
//     )
// }


import Avatar from '@/components/atom/Avatar';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import { PATH } from '@/routes/PATH';
import { useGetAgeGateUuidMutation } from '@/services/authApi';
import { clearTokens } from '@/slice/authSlice';
import { Box, ClickAwayListener, Fade, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Popper, Tooltip, Typography } from '@mui/material';
import { ArrowDown2, CloseCircle, Coin, Logout, MoneySend, Profile, TickCircle, Wallet2 } from "@wandersonalwes/iconsax-react";
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
const avataur1 = '/assets/images/avatar-6.png';


export default function ProfileBlock() {
    const anchorRef = useRef<any>(null);
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const pathname = usePathname();
    const search = useSearchParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector((state) => state?.auth.user);
    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    const id = open ? 'profile-dropdown' : ""

    React.useEffect(() => {
        setOpen(false);
    }, [pathname, search])

    const handleLogout = (e: React.MouseEvent) => {
        router.replace(PATH.AUTH.LOGIN.ROOT);
        e.preventDefault();
        dispatch(clearTokens());
    };
    const menuItems = [
        {
            label: "Profile",
            href: "/account",
            icon: <Profile size="20" className="group-hover:text-primary" />,
        },
        {
            label: "Game Credentials",
            href: "/credentials",
            icon: <Wallet2 size="20" className="group-hover:text-primary" />,
        },
        {
            label: "Deposit History",
            href: "/account?page=deposit-history",
            icon: <Coin size="20" className="group-hover:text-primary" />,
        },
        {
            label: "Withdraw History",
            href: "/account?page=withdrawl-history",
            icon: <MoneySend size="20" className="group-hover:text-primary" />,
        },
        {
            label: "Logout",
            href: "#",
            icon: <Logout size="20" className="group-hover:text-primary" />,
            onClick: handleLogout,
        },
    ];

    const adminMenuItems = [
        {
            label: 'Dashboard',
            href: '#',
            icon: <Profile size="20" className="group-hover:text-primary" />,
        },
        {
            label: 'Logout',
            href: '#',
            icon: <Logout size="20" className="group-hover:text-primary text-red-500" />,
            onClick: handleLogout,
        },
    ];

    const [glassStyle, setGlassStyle] = React.useState({ top: 0, height: 0, opacity: 0 });
    const menuListRef = React.useRef<HTMLUListElement>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
        const item = e.currentTarget;
        const list = menuListRef.current;

        if (item && list) {
            const itemRect = item.getBoundingClientRect();
            const listRect = list.getBoundingClientRect();
            const topPosition = itemRect.top - listRect.top;

            setGlassStyle({
                top: topPosition,
                height: itemRect.height,
                opacity: 1,
            });
        }
    };

    const handleMouseLeave = () => {
        setGlassStyle((prev) => ({ ...prev, opacity: 0 }));
    };

    const [getAgeGateUuid] = useGetAgeGateUuidMutation();

    const [isVerified, setIsVerified] = useState<boolean | null>(null);


    useEffect(() => {
        const fetchAgeStatus = async () => {
            try {
                const res = await getAgeGateUuid().unwrap();
                setIsVerified(res?.data?.is_age_verified);
            } catch (e) {
                console.log(e)
                // console.error("Failed to fetch age verification status", err);
                setIsVerified(false);
            }
        };

        fetchAgeStatus();
    }, [getAgeGateUuid])

    return (
        <Box >
            <a
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                className='!hover:bg-transparent cursor-pointer'
                style={{
                    padding: 0
                }}
            >
                <Tooltip title={isVerified ? "Verified" : "Not Verified"} placement="bottom">
                    <div className=' lg:flex items-center gap-1 relative'>
                        <Avatar alt="profile user" src={avataur1} />
                        {user?.role && user.role.toLowerCase() !== "user" ? <>
                            <div className=' hidden lg:block'>
                                <strong className='text-[14px] leading-[120%] font-bold text-text-title block mb-1 text-nowrap'>{user?.name}</strong>
                                <p className='text-[12px] text-left leading-[120%] font-[500] text-para-light text-nowrap'>
                                    {user?.role || "User"}
                                </p>
                            </div>
                            <ArrowDown2 size={14} className='text-primary hidden lg:block' />
                        </> : ""}
                        <div className="absolute bottom-0 right-0">
                            {isVerified ? (
                                <TickCircle variant="Bold" size={14} className="text-green-600" />
                            ) : (
                                <span className="flex items-center justify-center w-[14px] h-[14px] rounded-full bg-yellow-400 text-[10px] font-bold text-white">
                                    !
                                </span>
                            )}
                        </div>
                    </div>
                </Tooltip>
            </a>
            <Popper
                id={id}
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-end"
                transition
                style={{ zIndex: 1300 }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={300}>
                        <Paper
                            elevation={3}
                            sx={{
                                width: 315,
                                borderRadius: 2,
                                mt: 1,
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                {
                                    user?.role && user.role.toLowerCase() !== "user" ? (
                                        <List ref={menuListRef}
                                            onMouseLeave={handleMouseLeave}
                                            style={{ position: 'relative' }}>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    left: "0",
                                                    right: "0",
                                                    top: `${glassStyle.top}px`,
                                                    height: `${glassStyle.height}px`,
                                                    background: "rgba(255, 255, 255, 0.15)",
                                                    backdropFilter: "blur(12px)",
                                                    WebkitBackdropFilter: "blur(12px)",
                                                    border: "1px solid rgba(255, 255, 255, 0.25)",
                                                    borderRadius: "8px",
                                                    boxShadow: `
                                0 8px 32px 0 #ddd,
                                inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
                                0 0 20px rgba(255, 255, 255, 0.1)
                            `,
                                                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                                    pointerEvents: "none",
                                                    zIndex: 1,
                                                    opacity: glassStyle.opacity,
                                                    transform:
                                                        glassStyle.opacity === 1
                                                            ? "translateY(0) scale(1)"
                                                            : "translateY(0) scale(0.95)",
                                                }}
                                            />
                                            {adminMenuItems.map((item, idx) => (
                                                <ListItem key={idx} disablePadding onMouseEnter={handleMouseEnter}
                                                    style={{
                                                        position: 'relative',
                                                        zIndex: 2,
                                                        padding: 0,
                                                    }}>

                                                    {!item?.onClick ? <Link
                                                        href={item.href || ""}

                                                        className={`flex items-center py-3 px-4 `}
                                                    >
                                                        <ListItemIcon className="min-w-[30px] mr-1 group-hover:text-primary">{item.icon}</ListItemIcon>
                                                        <ListItemText primary={item.label} className='group-hover:text-primary' />

                                                    </Link> : <ListItemButton
                                                        href={item.href || ""}
                                                        onClick={item.onClick}
                                                        className={`flex items-center py-3 px-4 !wit`}
                                                    >
                                                        <ListItemIcon className="min-w-[30px] mr-1 group-hover:text-primary">{item.icon}</ListItemIcon>
                                                        <ListItemText primary={item.label} className='group-hover:text-primary' />
                                                    </ListItemButton>}
                                                </ListItem>))}
                                        </List>
                                    ) : (
                                        <List ref={menuListRef}
                                            onMouseLeave={handleMouseLeave}
                                            style={{ position: 'relative' }}>
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    right: '0',
                                                    top: `${glassStyle.top}px`,
                                                    height: `${glassStyle.height}px`,
                                                    background: 'rgba(255, 255, 255, 0.15)',
                                                    backdropFilter: 'blur(12px)',
                                                    WebkitBackdropFilter: 'blur(12px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                                    borderRadius: '8px',
                                                    boxShadow: `
                        0 8px 32px 0 rgba(0, 0, 0, 0.37),
                        inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
                        0 0 20px rgba(255, 255, 255, 0.1)
                    `,
                                                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                    pointerEvents: 'none',
                                                    zIndex: 1,
                                                    opacity: glassStyle.opacity,
                                                    transform: glassStyle.opacity === 1 ? 'translateY(0) scale(1)' : 'translateY(0) scale(0.95)',
                                                }}
                                            />
                                            {menuItems.map((item, idx) => (
                                                <ListItem key={idx} disablePadding onMouseEnter={handleMouseEnter}
                                                    style={{
                                                        position: 'relative',
                                                        zIndex: 2,
                                                        padding: 0,
                                                    }}>
                                                    {!item?.onClick ?
                                                        <Link
                                                            href={item.href || ""}
                                                            className={`flex items-center py-3 px-4 `}
                                                        >
                                                            <ListItemIcon className="min-w-[30px] mr-1 group-hover:text-primary">{item.icon}</ListItemIcon>
                                                            <ListItemText primary={item.label} className='group-hover:text-primary' />
                                                            {item.label === "Profile" && (
                                                                <div
                                                                    className={`status flex flex-nowrap items-center gap-1 ml-auto p-1.5 rounded
      ${isVerified
                                                                            ? "bg-green-600/40 text-green-600"
                                                                            : "bg-red-600/40 text-red-600"
                                                                        }`}
                                                                >
                                                                    {isVerified ? (
                                                                        <TickCircle variant="Bold" size={12} />
                                                                    ) : (
                                                                        <CloseCircle variant="Bold" size={12} />
                                                                    )}

                                                                    <Typography className="text-[10px]!">
                                                                        {isVerified ? "Verified" : "Not Verified"}
                                                                    </Typography>
                                                                </div>
                                                            )}
                                                        </Link> :
                                                        <ListItemButton
                                                            href={item.href || ""}
                                                            onClick={item.onClick}
                                                            className={`flex items-center py-3 px-4 !wit`}
                                                        >
                                                            <ListItemIcon className="min-w-[30px] mr-1 group-hover:text-primary">{item.icon}</ListItemIcon>
                                                            <ListItemText primary={item.label} className='group-hover:text-primary' />

                                                        </ListItemButton>}
                                                </ListItem>
                                            ))}
                                        </List>
                                    )
                                }

                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </Box>
    )
}
