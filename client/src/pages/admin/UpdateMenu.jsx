import React from 'react'
import UpdateMenuForm from '../../components/admin/UpdateMenuForm'
import Breadcrumb from '../../ui/Breadcrumb'
import { ChevronRight } from 'lucide-react'

export default function UpdateMenu() {
    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Menu', href: '/menu' },
                    { label: 'Update Menu' }
                ]}
                showHome={true}
                homeIcon={true}
                separator={<ChevronRight size={15} />}
            />

            <div className='bg-linear-to-br from-orange-50 to-teal-50 '>
                <UpdateMenuForm />
            </div>
        </>
    )
}
