"use client";

import React, { useRef, useState } from 'react';
import {
    Badge,
    Box,
    IconButton,
    Popper,
    Paper,
    ClickAwayListener,
    Typography,
    List,
    ListItem,
} from '@mui/material';
import Fade from '@mui/material/Fade'; // ✅ Import Fade
import { Notification } from '@wandersonalwes/iconsax-react';
import Link from 'next/link';
import { NotificationProps } from '@/types/notification';
import { Pagination } from '@/types/game';
import { useReadAllNotificationMutation, useReadNotificationMutation } from '@/services/notificationApi';
import { useAppDispatch } from '@/hooks/hook';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { formatDateTime } from '@/utils/formatDateTime';


export default function NotificationPage({
    notifications,
    pagination
}: {
    notifications: NotificationProps[]
    pagination: Pagination | undefined
}) {
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const handleToggle = () => setOpen((prev) => !prev);

    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current?.contains(event.target as Node)) return;
        setOpen(false);
    };

    const id = open ? 'popper' : undefined;
    const dispatch = useAppDispatch();

    const [readNotification, { isLoading }] = useReadNotificationMutation();
    const [readAllNotification, { isLoading: readingAll }] = useReadAllNotificationMutation();
    const handleNotificationClick = async (id?: string) => {
        if (id) {
            try {
                const response = await readNotification({ id }).unwrap();
                // dispatch(
                //     showToast({
                //         message: "Notification read successfully",
                //         variant: ToastVariant.SUCCESS
                //     })
                // )
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to read notification",
                        variant: ToastVariant.ERROR
                    })
                )
            }
        }
        else {
            try {
                const response = await readAllNotification().unwrap();
                setOpen(false);
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to read notification",
                        variant: ToastVariant.ERROR
                    })
                )
            }
        }
    }

    return (
        <Box>
            <IconButton
                aria-describedby={id}
                ref={anchorRef}
                onClick={handleToggle}
                className="!bg-light-gray"
            >
                <Badge
                    badgeContent={notifications.filter((item) => item.has_read === false).length}
                    color="success"
                    sx={{ '& .MuiBadge-badge': { top: 2, right: 4 } }}
                >
                    <Notification variant="Bold" className="!text-para-light" />
                </Badge>
            </IconButton>

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
                                width: 300,
                                borderRadius: 2,
                                mt: 1,
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box>
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <Typography variant="h3" >
                                            Notifications
                                        </Typography>
                                        {pagination && pagination?.count > 2 ? <Link href={"#"} className='text-[12px] leading-[120%] hover:text-primary-dark font-medium'>View All</Link> : ""}
                                        <p onClick={() => handleNotificationClick()} className='text-[12px] leading-[120%] text-primary hover:text-primary-dark font-medium cursor-pointer'>Mark All Read</p>
                                    </div>
                                    {
                                        notifications.length ? (
                                            <List className='max-h-[320px] overflow-auto px-1'>
                                                {
                                                    notifications.map((notification, index) => {
                                                        const { date, time } = formatDateTime(notification.created_at);
                                                        return (
                                                            <ListItem className={`border-b-solid border-b-gray-100 border-b-[1px] rounded-sm !p-2 cursor-pointer mb-2 ${notification.has_read ? "" : "bg-gray-100"} ${index > 0 ? " " : ""}`} key={notification.id} onClick={() => handleNotificationClick(notification.id)}>
                                                                <p className='text-[12px] lg:text-[12px] leading-[120%] text-title line-clamp-2'>{notification.message}</p>
                                                                <p className='!text-[8px] mt-1 font-[500] lg:text-[12px] leading-[120%] text-para-light'>{date}</p>
                                                            </ListItem>
                                                        )
                                                    })
                                                }
                                            </List>
                                        ) : (
                                            <Typography variant="body2" color="text.title" sx={{ pt: 1, px: 1 }}>
                                                No new notifications
                                            </Typography>
                                        )
                                    }

                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </Box>
    );
}
