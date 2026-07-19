"use client"

import React, { useEffect, useState } from 'react'
import {Eye} from 'lucide-react';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from '@/components/ui/switch'
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import LoginNow from '@/components/adminsection/login/page';
import { Button } from '@/components/ui/button';







export default function AdminStore() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({});
  const [interview, setInterview] = useState<BlogPost[]>([]) 
  const [loading, setLoading] = useState<boolean>(false) 

  const [isLoggedIn, setIsLoggedIn] = useState(false);
 

  

  useEffect(() => {
    const logintoken = localStorage.getItem('token');
    //console.log(logintoken);
    if (logintoken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    const fetchInterviews = async () => {
      try {
        setLoading(true) // Start loading
        const  data  = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/interview/show-interview-all`)
        setInterview(data.data.interviews || [])
      } catch (error) {
        console.error('Error fetching interviews:', error)
        setInterview([])
      } finally {
        setLoading(false) // Stop loading
      }
    }

    fetchInterviews()
  }, [])

  const handlevisiblity = async (id: string) => {
    try {
      const response = await axios.post('/api/interview/varify-interview', { id }); 
      console.log(response.status)
      if (response.status==200) {
        
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error || 'An error occurred');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'An error occurred');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  const VisibilityCell = ({ row }: { row: { original: BlogPost } }) => {
    const [isVisible, setIsVisible] = useState(row.original.issee); 
  
    const toggleVisibility = async () => {
      setIsVisible(!isVisible); 
      try {
        await handlevisiblity(row.original._id);
      } catch (error) {
        setIsVisible(row.original.issee);
        console.log(error);
      }
    };
  
    return (
      <div>
        <Switch id={`${row.original._id}`} checked={isVisible} onCheckedChange={toggleVisibility} />
      </div>
    );
  };
  
  
  
  const columns: ColumnDef<BlogPost>[] = [
  
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "companyname",
      header: "Company",
      cell: ({ row }) => <div className="text-gray-600">{row.getValue("companyname")}</div>,
    },
    {
      accessorKey: "visibility",
      header: "Visibility",
      cell:VisibilityCell
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="relative">
          <Link href={`/interview/${row.original._id}`} passHref>
            <button className="relative group bg-gray-200 p-2 rounded-md hover:bg-gray-300">
              <Eye className="w-5 h-5 text-gray-600" />
              <span className="absolute left-1/2 transform -translate-x-1/2  bg-white text-black text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                View
              </span>
            </button>
          </Link>
        </div>
      ),
    },
  ];
  const table = useReactTable({
    data: interview, 
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleLogin = async (data:{ email: string; password: string }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, data);
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('token', response.data.user.accessToken);
        window.location.replace('/admin-newsletters');
      } else {
        toast.error(response.data.error || 'An error occurred');
      }
    }  catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'An error occurred');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <Dialog open={true}>
        <DialogContent className='max-w-[350px] md:max-w-[400px] rounded-2xl'>
          <DialogTitle>
            <LoginNow onRegister={handleLogin} />
          </DialogTitle>
        </DialogContent>
      </Dialog>
    );
  }




  return (
    
    <div className="w-full   border-t-[1px] py-[80px]  flex flex-col justify-center   max-w-screen-xl mx-auto px-4">
      {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#707FDD] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
      <div className="rounded-md border mt-8">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
        )}
 <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

    </div>
  )
}
