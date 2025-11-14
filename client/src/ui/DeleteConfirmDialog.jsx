import { AlertCircle } from 'lucide-react';

const DeleteConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType = "item",
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Delete {itemType}?
                </h3>

                <p className="text-gray-600 text-center mb-2">
                    Are you sure you want to delete
                </p>

                <p className="text-lg font-bold text-primary text-center mb-6">
                    "{itemName}"
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (!isLoading) {
                                onClose();
                            }
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 py-3.5 px-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`flex-1 bg-red-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all
                            ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-red-600"}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default DeleteConfirmDialog;