
'use client'
import { SearchForm } from '@/shared/components/search-form'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { IconDownload, IconPlus } from '@tabler/icons-react'
import React from 'react'
import TableStandardUser from './table-manage-user'
import { Label } from '@/shared/components/ui/label'
import { Select } from '@/shared/components/ui/select'

function PageStandardUser() {
    function onAddNew() { }
    return (
        <div className='flex items-center justify-between px-4 lg:px-6'>
            <Label htmlFor='view-selector' className='sr-only'>
                View
            </Label>
            <Select >

            </Select>
            <Card>
                <CardHeader className='flex items-end justify-between border-b border-border'>
                    <SearchForm placeholdertext='Search standard user...' className='p-2' />
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