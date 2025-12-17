"use client";
import ActionGroup from '@/components/molecules/Action';
import TableHeader from '@/components/molecules/TableHeader';
import CustomTable from '@/components/organism/Table';
import { useAppDispatch } from '@/hooks/hook';
import { PATH } from '@/routes/PATH';
import { useDeletePageByIdMutation, useGetAllPageQuery } from '@/services/pageApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { PageRequestProps } from '@/types/page';
import { formatDateTime } from '@/utils/formatDateTime';
import { Checkbox, Pagination } from '@mui/material';
import { ColumnDef, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react'

export default function GeneralPageLiting() {
    const dispatch = useAppDispatch();
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading: loadingPages } = useGetAllPageQuery({
        pageIndex,
        pageSize,
        search: search || ""
    });
    const [deletePage, { isLoading: deleting }] = useDeletePageByIdMutation();

    const filteredData = useMemo(() => data?.data?.data || [], [data]);

    const columns = useMemo<ColumnDef<PageRequestProps>[]>(() => [
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
            header: "Title",
            cell: ({ row }) => (
                <strong className="text-primary block text-[12px] leading-[120%] font-[500] capitalize">
                    {row.original.name}
                </strong>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <span className="text-[12px] font-[500] max-w-[380px]">{row.original.description}</span>
            )
        },
        {
            accessorKey: 'registeredDate',
            header: 'Registered Date',
            cell: ({ row }) => {
                const { date, time } = formatDateTime(row.original.date)
                return (
                    <span className="text-[12px] font-[500] max-w-[380px]">{date}</span>
                )
            }
        },
        {
            id: 'action',
            header: 'Action',
            cell: ({ row }) => (
                <ActionGroup
                    // onView={`${PATH.ADMIN.PAGES.ROOT}/${row.original.id}`}
                    onEdit={`${PATH.ADMIN.PAGES.EDIT_PAGE.ROOT}/${row.original.id}`}
                    onDelete={async () => {
                        const response = await deletePage({ id: row.original.id || "" }).unwrap();
                        dispatch(
                            showToast({
                                message: response.message,
                                variant: ToastVariant.SUCCESS
                            })
                        )
                    }}
                />
            ),
        },
    ], []);

    const table = useReactTable({
        data: filteredData || [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <section className="genral__page__lisiting">
            <div className="border-gray border-solid border-[1px] rounded-[8px] lg:rounded-[16px]">
                <TableHeader
                    search={search}
                    setSearch={setSearch}
                // onDownloadCSV={() => { }}
                />
                <CustomTable
                    table={table}
                    loading={loadingPages}
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
