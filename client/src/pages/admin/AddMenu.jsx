import React from 'react'
import Breadcrumb from '../../ui/Breadcrumb'
import { ChevronRight } from 'lucide-react'
import AddMenuForm from '../../components/admin/AddMenuForm'

export default function AddMenu() {
    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Menu', href: '/admin/menu' },
                    { label: 'Add Menu' }
                ]}
                showHome={true}
                homeIcon={true}
                separator={<ChevronRight size={15} />}
            />

            <div className='bg-linear-to-br from-orange-50 to-teal-50 '>
                <AddMenuForm />
            </div>
        </>
    )
}
