import { useEffect, useState } from 'react';
import TiffinFilter from '../../components/admin/TiffinFilters';
import TiffinCard from '../../components/admin/TiffinCard';
import TiffinDetailModal from '../../components/admin/TiffinDetailModal';
import Breadcrumb from '../../ui/Breadcrumb';
import { ChevronRight } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';

// Tiffin Card Component


// Demo Parent Component showing usage
const Tiffin = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedTiffin, setSelectedTiffin] = useState(null);
    const [tiffins, setTiffins] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    useEffect(() => {
        const fetchTiffins = async () => {
            try {
                const response = await axiosClient.get("/api/v1/tiffin/all");
                console.log("Fetched tiffins:", response.data.data);
                setTiffins(response.data.data);

            } catch (error) {
                console.log("Error fetching tiffins:", error);

            }
        }
        fetchTiffins();
    }, []);

    const filteredTiffins = tiffins.filter(tiffin => {
        if (selectedFilter === 'all') return true;
        return tiffin.foodType === selectedFilter;
    });

    const handleView = (tiffin) => {
        setSelectedTiffin(tiffin);
    };

    const handleEdit = (tiffin) => {
        alert(`Editing: ${tiffin.name}`);
        // Implement your edit logic here
    };

    const handleDelete = async (tiffin) => {
        try {
            const response = await axiosClient.delete(`/api/v1/tiffin/${tiffin._id}`);
            setTiffins(prevTiffins => prevTiffins.filter(t => t._id !== tiffin._id));
            showSnackbar("Tiffins Loaded Successfully", "success");
        } catch (error) {
            console.error("Error deleting tiffin:", error);
            showSnackbar("Error While Deleting ", "error");
        }
    };

    return (
        <>
            <Breadcrumb
                items={[{ label: 'Tiffin' }]}
                showHome={true}
                homeIcon={true}
                separator={<ChevronRight size={15} />}
            />
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={8000}
                onClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }}
            />

            <div className="min-h-screen bg-linear-to-br from-orange-50 to-blue-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Filter Component */}
                    <TiffinFilter
                        selectedFilter={selectedFilter}
                        onFilterChange={setSelectedFilter}
                    />

                    {/* Tiffin Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {filteredTiffins.map(tiffin => (
                            <TiffinCard
                                key={tiffin._id}
                                tiffin={tiffin}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredTiffins.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-xl">No tiffins found for this filter</p>
                        </div>
                    )}

                    {/* Detailed View Modal */}
                    {selectedTiffin && (
                        <TiffinDetailModal
                            tiffin={selectedTiffin}
                            onClose={() => setSelectedTiffin(null)}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Tiffin;