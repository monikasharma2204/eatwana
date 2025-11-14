import { useEffect, useState } from "react";
import MenuDisplay from "../../components/admin/MenuDisplay";
import axiosClient from "../../services/axiosClient";
import { RippleLoader } from "../../ui/Loader";
import { ChevronRight } from "lucide-react";
import Breadcrumb from "../../ui/Breadcrumb";
import AlertSnackbar from "../../ui/AlertSnackbar";

const Menu = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
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
        const fetchMenus = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get('/api/v1/menu/all');
                console.log("Fetched menus:", response.data.data);
                setMenus(response.data.data);
            } catch (error) {
                console.log("Error fetching menus:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);

    const handleDelete = async (menuId) => {
        try {
            const response = await axiosClient.delete(`/api/v1/menu/delete/${menuId}`);
            showSnackbar("Menu Deleted successful!", "success");
            setMenus((prevMenus) => prevMenus.filter((menu) => menu._id !== menuId));
        } catch (error) {
            console.log("Error deleting menu:", error);
            showSnackbar("Error deleting menu:", "error");
        }
    };

    // 🔥 If loading, show loader only
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <RippleLoader size={60} color="#e7582e" />
            </div>
        );
    }

    return (
        <>
            <Breadcrumb
                items={[{ label: 'Menu' }]}
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <MenuDisplay
                        menus={menus}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </>
    );
};

export default Menu;
