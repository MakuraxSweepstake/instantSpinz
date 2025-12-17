"use client";

import CustomTable from '@/components/organism/Table';
import { useGetAllDepositQuery } from '@/services/transaction';
import { SingleDepositProps } from '@/types/transaction';
import { Pagination } from '@mui/material';
import { ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react'

export default function DepositHistoryPage(
  { currentFilter,
    customRange
  }:
    {
      currentFilter: number | null;
      customRange: { startDate: string | null, endDate: string | null }
    }) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useGetAllDepositQuery({
    days: currentFilter,
    customRange,
    pageIndex: pageIndex,
    pageSize: pageSize
  });
  const columns: ColumnDef<SingleDepositProps>[] = [
    {
      accessorKey: 'id',
      header: "ID",
      cell: ({ row }) => row.original.transaction_id
    },
    {
      accessorKey: 'transaction_date',
      header: "Date",
    },
    {
      accessorKey: 'amount',
      header: "Amount",
    },
    {
      accessorKey: 'game_name',
      header: "Game",
    },
    {
      accessorKey: 'available_balance',
      header: "Available Balance",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status.toLowerCase();
        const display = status.charAt(0).toUpperCase() + status.slice(1);

        return (
          <span className={`px-2 py-1 max-w-fit block lg:text-[10px] text-white status rounded-[8px] text-center ${status}`} >
            {display}
          </span>
        );
      },
    }
  ]


  const table = useReactTable({
    data: data?.data?.data || [],
    // data: dummyDeposits,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

  })
  return (
    <>
      <CustomTable table={table} loading={isLoading} emptyMessage="You haven't deposite yet!" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 px-8 py-6 gap-4">

        <Pagination count={data?.data?.pagination?.total_pages || 1}
          page={pageIndex}
          onChange={(_, value) => setPageIndex(value)} variant="outlined" shape="rounded" sx={{ gap: "8px" }} />
        <div>
          <span>Row per page:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="ml-2 border bg-[#11011E] border-gray-300 rounded p-1"
          >
            {[5, 10, 15, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}
