import React from 'react'
import SubCategoryForm from '../../components/admin/SubCategoryForm'
import Breadcrumb from '../../ui/Breadcrumb'
import { ChevronRight } from 'lucide-react'

export default function AddSubCategory() {
    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Sub-Category', href: '/admin/sub-categories' },
                    { label: 'Add Sub Category' }
                ]}
                showHome={true}
                homeIcon={true}
                separator={<ChevronRight size={15} />}
            />

            <SubCategoryForm />
        </>
    )
}
