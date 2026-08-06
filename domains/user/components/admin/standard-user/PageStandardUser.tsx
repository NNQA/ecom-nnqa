
'use client'
import { SearchForm } from '@/shared/components/search-form'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { IconDownload, IconPlus } from '@tabler/icons-react'
import React from 'react'
import TableStandardUser from './table-manage-user'

function PageStandardUser() {
    function onAddNew() { }
    return (
        <div>
            <div className="mb-4.5 flex flex-wrap items-end justify-between gap-3.5">
                <div>
                    <div className="text-[22px] font-extrabold tracking-[-0.01em]">User Permission</div>
                    <div className="mt-0.75 text-[13.5px] text-muted-foreground">Control what each staff role can see and do across the store admin</div>
                </div>
                <div className='space-x-2.5'>
                    <Button variant='outline' className="h-10 px-4 font-bold" onClick={onAddNew}>
                        <IconDownload className='size-4' />
                        Export
                    </Button>
                    <Button className="h-10 px-4 font-bold" onClick={onAddNew}>
                        <IconPlus className='size-4' />
                        Add user
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader className='flex items-end justify-between'>
                    <SearchForm placeholdertext='Search standard user...' />
                    <div className='space-x-2.5'>
                        <Button variant='outline' onClick={onAddNew}>
                            <IconDownload className='size-4' />
                            Filter
                        </Button>
                        <Button variant='outline' onClick={onAddNew}>
                            <IconPlus className='size-4' />
                            Columns
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <TableStandardUser>
                    </TableStandardUser>
                </CardContent>
            </Card>
        </div>
    )
}

export default PageStandardUser