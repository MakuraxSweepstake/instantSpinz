"use client";
import TableHeader from '@/components/molecules/TableHeader';
import CustomTable from '@/components/organism/Table';
import { User, Lock, ArrowUp, ArrowDown } from '@wandersonalwes/iconsax-react';
import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, ColumnDef } from '@tanstack/react-table';
import { Pagination, Box } from '@mui/material';
import { TransactionStatusProps } from '../transaction/TransactionTable';
import { StatusOptions } from '@/types/config';
import { useGetAllActivityQuery } from '@/services/notificationApi';
import { ActivityProps } from '@/types/notification';



export default function Activities() {
    const activityTypes = [
        // { value: '', label: 'All Activities' },
        { value: 'registration', label: 'Registration' },
        { value: 'login', label: 'Login/Logout' },
        { value: 'deposit', label: 'Deposits' },
        { value: 'withdrawal', label: 'Withdrawals' },
        { value: 'password_update', label: 'Security' },
        { value: 'game_play', label: 'Games' },
        { value: 'profile_update', label: 'Profile Updates' },
        { value: 'bonus', label: 'Bonuses' },
        { value: 'user', label: 'User' }
    ];


    const [search, setSearch] = React.useState("");
    const [pageIndex, setPageIndex] = React.useState(1);
    const [status, setStatus] = React.useState<TransactionStatusProps | undefined>();
    const [pageSize, setPageSize] = React.useState(10);
    const [activityType, setActivityType] = React.useState("");
    const [sorting, setSorting] = React.useState<any>([]);
    // const [download, { isLoading: downloading }] = useStartDownloadMutation();
    const queryArgs = useMemo(
        () => ({
            pageIndex,
            pageSize,
            search: search || "",
            activity_type: activityType,
            status
        }),
        [pageIndex, pageSize, search, status, activityType]
    );


    const { data, isLoading } = useGetAllActivityQuery(queryArgs)

    const columns = useMemo<ColumnDef<ActivityProps>[]>(() => [
        {
            accessorKey: "id",
            header: ({ column }) => {
                const sortState = column.getIsSorted();
                const arrow =
                    sortState === "asc" ? (
                        <ArrowUp size={14} />
                    ) : sortState === "desc" ? (
                        <ArrowDown size={14} />
                    ) : <ArrowUp size={14} className="opacity-30" />;

                return (
                    <p
                        onClick={() => column.toggleSorting()}
                        className="flex items-center gap-1 cursor-pointer"
                    >
                        #ID {arrow}
                    </p>
                );
            },
        },
        {
            accessorKey: "user",
            header: "User",
            cell: ({ row }) => {
                const { username, email } = row.original
                return (
                    <div className="name-detail">
                        <strong className="text-primary block text-[12px] leading-[120%] font-[500] capitalize">
                            {username}
                        </strong>
                        <small className="text-[10px] text-para-light font-[500]">
                            {email}
                        </small>
                    </div>
                );
            },
        },
        {
            accessorKey: "type",
            header: "Activity Type",
            cell: ({ row }) => {
                const type = row.original.type;
                const display = type.split('_').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');

                return (
                    <span className="capitalize text-[12px] font-[500]">
                        {display}
                    </span>
                );
            },
        },
        {
            accessorKey: "details",
            header: "Details",
            cell: ({ row }) => (
                <span className="text-[11px] text-para-light max-w-[250px] block ">
                    {row.original.log}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status.toLowerCase();
                const display = status.charAt(0).toUpperCase() + status.slice(1);

                return (
                    <span
                        className={`px-2 py-1 max-w-[80px] block text-[10px] text-white status rounded-[8px] text-center ${status}`}
                    >
                        {display}
                    </span>
                );
            },
        },
        {
            accessorKey: "timestamp",
            header: "Timestamp",
            cell: ({ row }) => {
                const [date, time] = row.original.timestamp.split(' ');
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
        data: data?.data?.data || [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });


    return (
        <div className="border-gray border-solid border-[1px] rounded-[8px] lg:rounded-[16px]">
            <TableHeader

                search={search}
                setSearch={setSearch}
                filters={[
                    { value: activityType, setValue: setActivityType, options: activityTypes, placeholder: "Filter by type" },
                    { value: status || "", setValue: (value) => setStatus(value as TransactionStatusProps), options: StatusOptions, placeholder: "Filter by status" }
                ]}
                onDownloadCSV={() => { }}
            // downloading={downloading}
            />

            <CustomTable
                key={`${pageIndex}-${pageSize}-${search}-${activityType}`}
                table={table}
                loading={isLoading}
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
    );
}