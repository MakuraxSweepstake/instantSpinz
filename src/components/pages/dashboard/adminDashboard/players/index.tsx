"use client";

import CustomSwitch from '@/components/atom/Switch';
import ActionGroup from '@/components/molecules/Action';
import TabController from '@/components/molecules/TabController';
import TableHeader from '@/components/molecules/TableHeader';
import CustomTable from '@/components/organism/Table';
import { useAppDispatch } from '@/hooks/hook';
import { PATH } from '@/routes/PATH';
import { useDownloadUserMutation } from '@/services/downloadApi';
import { useDeletePlayerByIdMutation, useGetAllPlayerQuery, useSuspendPlayerByIdMutation } from '@/services/playerApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { PlayerItem } from '@/types/player';
import { formatDateTime } from '@/utils/formatDateTime';
import { getInitials } from '@/utils/getInitials';
import { Box, Checkbox, Pagination } from '@mui/material';
import { ColumnDef, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

export default function PlayerListing() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [currentTab, setCurrentTab] = React.useState("");
    const { data, isLoading: loadingPlayer } = useGetAllPlayerQuery({
        pageIndex,
        pageSize,
        search: search || "",
        status: currentTab || ""
    });

    const filteredData = useMemo(() => data?.data?.data || [], [data, currentTab, pageSize]);

    const [deletePlayer, { isLoading: deletingPlayer }] = useDeletePlayerByIdMutation();
    const [suspendPlayer, { isLoading: suspendingPlayer }] = useSuspendPlayerByIdMutation();
    const [downloadUser, { isLoading: downloading }] = useDownloadUserMutation();

    const handlePlayerSuspend = async (id: string) => {
        try {
            const response = await suspendPlayer({ id }).unwrap();
            dispatch(
                showToast({
                    message: response.message || "Player status updated successfully",
                    variant: ToastVariant.SUCCESS
                })
            )
        }
        catch (err: any) {
            dispatch(
                showToast({
                    message: err?.data?.message || "Failed to update player status",
                    variant: ToastVariant.ERROR
                })
            )
        }
    }
    const columns = useMemo<ColumnDef<PlayerItem>[]>(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    indeterminate={
                        table.getIsSomePageRowsSelected() &&
                        !table.getIsAllPageRowsSelected()
                    }
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            size: 50
        },
        {
            accessorKey: 'id',
            header: '#ID',
            cell: ({ row }) => row.original.id
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const { first_name, last_name, name } = row.original;
                const initials = getInitials(first_name, last_name) || getInitials(row.original.name);

                return (
                    <Box className="flex justify-start items-center gap-2">
                        <small className="text-[10px] w-[24px] h-[24px] flex items-center justify-center uppercase rounded-[4px] bg-[#1EB41B]/10 font-[500] text-[#1EB41B]">
                            {initials}
                        </small>
                        <div className="name-detail">
                            <strong className="text-primary block text-[12px] leading-[120%] font-[500] capitalize">
                                {first_name} {last_name}
                            </strong>
                            <small className="text-[10px] text-para-light font-[500]">{name}</small>
                        </div>
                    </Box>
                );
            },
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <span className="text-[12px] font-[500]">{row.original.email}</span>
            )
        },
        {
            accessorKey: "status",
            header: "Account Status",
            cell: ({ row }) => {
                const isSuspended = row.original.is_suspended; // true or false

                return (
                    <CustomSwitch isSuspended={isSuspended} onClick={() => handlePlayerSuspend(row.original.id)} />
                );
            },
        },
        {
            accessorKey: 'registeredDate',
            header: 'Registered Date',
            cell: ({ row }) => {
                const { date, time } = formatDateTime(row.original.registered_date as string);
                return (
                    <Box>
                        <span className="text-[12px] font-[500] block">{date}</span>
                        <small className="text-[10px] text-para-light font-[500]">[{time}]</small>
                    </Box>

                )
            }
        },
        {
            accessorKey: 'currentCredit',
            header: 'Current Credit',
            cell: ({ row }) => (
                <span className="text-[12px] font-[500]">{row.original.current_credit || "$0"}</span>
            )
        },
        {
            accessorKey: 'totalWithdrawn',
            header: 'Total Withdrawn',
            cell: ({ row }) => (
                <span className="text-[12px] font-[500]">{row.original.total_withdrawn || "$0"}</span>
            )
        },
        {
            id: 'action',
            header: 'Action',
            cell: ({ row }) => (
                <ActionGroup
                    onView={`${PATH.ADMIN.PLAYERS.ROOT}/${row.original.id}`}
                    onEdit={`${PATH.ADMIN.PLAYERS.EDIT_PLAYER.ROOT}/${row.original.id}`}
                    onDelete={async () => {
                        try {
                            const response = await deletePlayer({ id: row.original.id }).unwrap();
                            dispatch(
                                showToast({
                                    message: response.message || "Player deleted successfully",
                                    variant: ToastVariant.SUCCESS
                                })
                            )
                        }
                        catch (err: any) {
                            dispatch(
                                showToast({
                                    message: err?.data?.message || "Failed to delete player",
                                    variant: ToastVariant.ERROR
                                })
                            )
                        }
                    }}
                />
            ),
        },
    ], []);
    // const table = useReactTable({
    //     data: data?.data?.data || [],
    //     columns,
    //     state: {
    //         sorting,

    //     },
    //     onSortingChange: setSorting,
    //     getCoreRowModel: getCoreRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    // })
    const table = useReactTable({
        data: data?.data?.data || [],
        columns,
        state: {
            sorting,

        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


    const handleTabChange = (tab: string) => {
        setCurrentTab(tab);
    };

    return (
        <section className="player__listing_root">
            <div className="border-gray border-solid border-[1px] rounded-[8px] lg:rounded-[16px]">

                <TableHeader
                    search={search}
                    setSearch={setSearch}
                    onDownloadCSV={async () => {
                        try {
                            const res = await downloadUser({
                                search,
                                status: currentTab
                            }).unwrap();

                            const blob = new Blob([res], { type: "text/csv" });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `transactions_${new Date().toISOString()}.csv`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();

                            dispatch(
                                showToast({
                                    variant: ToastVariant.SUCCESS,
                                    message: "CSV Downloaded successfully.",
                                })
                            );
                        } catch (e: any) {
                            dispatch(
                                showToast({
                                    variant: ToastVariant.ERROR,
                                    message: e.message || "Unable to download CSV.",
                                })
                            );
                        }
                    }}
                    downloading={downloading}
                />
                <div className="px-4">
                    <TabController
                        links={[{ label: "All", value: "" }, { label: "Suspended", value: "suspend" }]}
                        currentTab={currentTab}
                        onTabChange={handleTabChange}
                    />
                </div>
                <CustomTable
                    table={table}
                    loading={loadingPlayer}
                />
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 px-8 py-6 gap-4">
                    <div>
                        <span>Row per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="ml-2 border border-gray-300 rounded p-1"
                        >
                            {[5, 10, 15, 20].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Pagination count={data?.data?.pagination?.total_pages || 1}
                        page={pageIndex}
                        onChange={(_, value) => setPageIndex(value)} variant="outlined" shape="rounded" sx={{ gap: "8px" }} />
                </div>
            </div>
        </section>
    )
}
