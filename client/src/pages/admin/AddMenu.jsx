import React from 'react'
import TiffinMenuForm from '../../components/admin/TiffinMenuForm'
import Breadcrumb from '../../ui/Breadcrumb'
import { ChevronRight } from 'lucide-react'

export default function AddMenu() {
    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Tiffin', href: '/tiffin' },
                    { label: 'Menu', href: '/tiffin/menu' },
                    { label: 'Add Menu' }
                ]}
                showHome={true}
                homeIcon={true}
                separator={<ChevronRight size={15} />}
            />

            <div className='bg-gradient-to-br from-orange-50 to-teal-50 '>
                <TiffinMenuForm />
            </div>
        </>
    )
}
