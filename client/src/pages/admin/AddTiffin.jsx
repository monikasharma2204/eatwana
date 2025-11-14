import React from 'react'
import TiffinForm from '../../components/admin/AddTifinForm';
import Breadcrumb from '../../ui/Breadcrumb';
import { ChevronRight } from 'lucide-react';

export default function AddTiffin() {
    const handleSuccess = (tiffin) => {
        console.log('Tiffin created:', tiffin);
        // Handle success (e.g., redirect, show message, etc.)
    };

    const handleCancel = () => {
        console.log('Form cancelled');
        // Handle cancel (e.g., go back, close modal, etc.)
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Tiffin', href: '/tiffin' },
                    { label: 'Add Tiffin' }
                ]}
                showHome={true}
                homeIcon={true}
                separator={<ChevronRight size={15} />}
            />
            <div className="min-h-screen bg-gray-50 py-8">
                <TiffinForm
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </>
    )
}
