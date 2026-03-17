import { useState } from "react";
import { useContactStore } from "../store/useContactStore";
import { Search, UserPlus, X, Loader2 } from "lucide-react";

const FindContactsModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const { searchResults, isSearching, searchByEmail, addContact, clearSearch } =
        useContactStore();

    const handleSearch = (e) => {
        e.preventDefault();
        if (email.trim()) {
            searchByEmail(email.trim());
        }
    };

    const handleClose = () => {
        setEmail("");
        clearSearch();
        onClose();
    };

    const handleAdd = async (userId) => {
        await addContact(userId);
        setEmail("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-base-300">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-base-300 bg-base-200/50">
                    <h3 className="text-lg font-semibold">Find Contacts</h3>
                    <button
                        onClick={handleClose}
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Search Form */}
                <div className="p-5">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="size-4 text-base-content/40" />
                            </div>
                            <input
                                type="email"
                                className="input input-bordered w-full pl-10 input-sm"
                                placeholder="Search by email address..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                            disabled={isSearching || !email.trim()}
                        >
                            {isSearching ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                "Search"
                            )}
                        </button>
                    </form>

                    {/* Results */}
                    <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.profilePic || "/avatar.png"}
                                            alt={user.fullName}
                                            className="size-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-sm">{user.fullName}</p>
                                            <p className="text-xs text-base-content/60">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    {user.isContact ? (
                                        <span className="text-xs text-success font-medium px-2 py-1 bg-success/10 rounded-lg">
                                            Already added
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleAdd(user._id)}
                                            className="btn btn-primary btn-sm gap-1"
                                        >
                                            <UserPlus className="size-4" />
                                            Add
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : email && !isSearching ? (
                            <div className="text-center py-8 text-base-content/50">
                                <Search className="size-8 mx-auto mb-2 opacity-40" />
                                <p className="text-sm">No users found with that email</p>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-base-content/50">
                                <UserPlus className="size-8 mx-auto mb-2 opacity-40" />
                                <p className="text-sm">
                                    Search for people by their email to add them
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindContactsModal;
