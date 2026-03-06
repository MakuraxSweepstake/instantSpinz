"use client";
import SortableHeader from '@/components/atom/SortableHeader';
import TableHeader from '@/components/molecules/TableHeader';
import CustomTable from '@/components/organism/Table';
import { useAppDispatch } from '@/hooks/hook';
import { useDownloadTransactionMutation } from '@/services/downloadApi';
import { useGetAllGamesQuery } from '@/services/gameApi';
import { useGetAllTransactionQuery } from '@/services/transaction';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { StatusOptions } from '@/types/config';
import { SingleDepositProps } from '@/types/transaction';
import { formatDateTime } from '@/utils/formatDateTime';
import { getInitials } from '@/utils/getInitials';
import { Box, Pagination } from '@mui/material';
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from '@wandersonalwes/iconsax-react';
import React, { useMemo, useState } from 'react';

export type TransactionStatusProps = "success" | "failed" | "pending";
export type TransactionTypeProps = "deposit" | "withdrawl";

export default function TransactionTable({ user_id, game_id, search, setSearch }: { user_id?: string; game_id?: number, search: string, setSearch?: (newvalue: string) => void }) {

    const dispatch = useAppDispatch();

    const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowSelection, setRowSelection] = useState({});
    const [status, setStatus] = React.useState<TransactionStatusProps | undefined>();
    const [selectedGame, setSelectedGame] = React.useState("");
    const [selectedTransactionType, setSelectedTransationType] = React.useState<TransactionTypeProps | string>("");
    const [customRange, setCustomRange] = React.useState({
        startDate: "",
        endDate: ""
    })

    const queryArgs = useMemo(
        () => ({
            page,
            per_page: pageSize,
            search: search || "",
            game_id,
            user_id,
            status,
            selectedGame,
            selectedTransactionType,
            start_date: customRange.startDate,
            end_date: customRange.endDate
        }),
        [page, pageSize, search, game_id, user_id, status, selectedGame, selectedTransactionType, customRange]
    );

    const { data, isLoading: loadingTransaction } = useGetAllTransactionQuery(queryArgs);
    const [downloadTransaction, { isLoading: downloading }] = useDownloadTransactionMutation();

    const tableData = useMemo(() => data?.data?.data || [], [data]);

    const columns = useMemo<ColumnDef<SingleDepositProps>[]>(() => [
        {
            accessorKey: "id",
            header: ({ column }) => <SortableHeader column={column} label="#ID" />,
        },
        {
            accessorKey: "name",
            header: ({ column }) => <SortableHeader column={column} label="Player Name" />,
            cell: ({ row }) => {
                const { first_name, last_name } = row.original;
                const initials = getInitials(first_name, last_name) || getInitials(row.original.username);
                return (
                    <Box className="flex items-center gap-2">
                        <small className="text-[10px] w-[24px] h-[24px] flex items-center justify-center uppercase rounded-[4px] bg-[#1EB41B]/10 font-[500] text-[#1EB41B]">
                            {initials}
                        </small>
                        <div>
                            <strong className="text-primary text-[12px] font-[500] capitalize block">
                                {first_name} {last_name}
                            </strong>
                            <small className="text-[10px] text-para-light font-[500]">
                                {row.original.username}
                            </small>
                        </div>
                    </Box>
                );
            },
        },
        {
            accessorKey: "type",
            header: ({ column }) => <SortableHeader column={column} label="Transaction Type" />,
        },
        {
            accessorKey: "game_name",
            header: ({ column }) => <SortableHeader column={column} label="Game Name" />,
        },
        {
            accessorKey: "status",
            header: ({ column }) => <SortableHeader column={column} label="Status" />,
            cell: ({ row }) => {
                const status = row.original.status.toLowerCase();
                const display = status.charAt(0).toUpperCase() + status.slice(1);
                return (
                    <span className={`px-2 py-1 max-w-[60px] block lg: text-[10px] text-white status rounded-[8px] text-center ${status}`} > {display} </span >
                );
            },
        },
        {
            accessorKey: "amount",
            header: ({ column }) => <SortableHeader column={column} label="Amount USD" />,
        },
        {
            accessorKey: "sweepcoins",
            header: ({ column }) => <SortableHeader column={column} label="Sweepcoins" />,
        },
        {
            accessorKey: "transaction_date",
            header: ({ column }) => <SortableHeader column={column} label="Transaction Date" />,
            cell: ({ row }) => {
                const { date, time } = formatDateTime(row.original.transaction_date as string);
                return (
                    <Box>
                        <span className="text-[12px] font-[500] block">{date}</span>
                        <small className="text-[10px] text-para-light font-[500]">[{time}]</small>
                    </Box>
                );
            },
        },
    ], []);


    const table = useReactTable({
        data: tableData,
        columns,
        state: { sorting },
        // enableRowSelection: true,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // onRowSelectionChange: setRowSelection,
    });

    const { data: games, isLoading } = useGetAllGamesQuery();



    return (
        <div className="border-gray border-solid border-[1px] rounded-[8px] lg:rounded-[16px]">

            <TableHeader
                search={search}
                setSearch={setSearch && setSearch}
                onDownloadCSV={async () => {
                    try {
                        const res = await downloadTransaction({
                            user: user_id?.toString(),
                            game: game_id?.toString(),
                            search,
                            status
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
                                message: e?.data?.message || "Unable to download CSV.",
                            })
                        );
                    }
                }}
                downloading={downloading}
                filters={[
                    {
                        value: status || "",
                        setValue: (value) => setStatus(value as TransactionStatusProps),
                        options: StatusOptions,
                        placeholder: "Filter by status",
                    },
                    {
                        value: selectedGame || "",
                        setValue: (value) => setSelectedGame(value as string),
                        options: games?.data?.data.map((game) => ({
                            label: game.name,
                            value: game.id.toString(),
                        })) || [],
                        placeholder: "Filter by Game",
                    },
                    {
                        value: selectedTransactionType || "",
                        setValue: (value) => setSelectedTransationType(value as string),
                        options: [
                            { label: "All", value: "" },
                            { label: "Withdrawal", value: "withdrawal" },
                            { label: "Deposit", value: "deposit" },
                        ],
                        placeholder: "Filter by Transaction Type",
                    },
                ]}
                customRange={customRange}
                setCustomRange={setCustomRange}
            />


            <>
                <CustomTable
                    key={`${page}-${pageSize}-${search}-${game_id}-${user_id}`}
                    table={table} loading={loadingTransaction} />

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
                        page={page}
                        onChange={(_, value) => setPage(value)} variant="outlined" shape="rounded" sx={{ gap: "8px" }} />
                </div>
            </>
        </div>
    );
}
