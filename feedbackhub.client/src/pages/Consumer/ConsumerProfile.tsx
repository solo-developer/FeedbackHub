import React, { useState, ChangeEvent } from "react";
import { useUser } from "../../contexts/UserContext";
import FullScreenLoader from "../../components/FullScreenLoader";
import { updateAvatarAsync } from "../../services/UserService";
import { UpdateAvatarDto } from "../../types/account/UpdateAvatarDto";
import { useToast } from "../../contexts/ToastContext";
import { buildFormData } from "../../utils/FormDataHelper";

const ConsumerProfilePage: React.FC = () => {
    const [avatarPreview, setAvatarPreview] = useState<string>(
        "/assets/images/default-user.png"
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const { showToast } = useToast();

    var { user ,refreshUser} = useUser();
    if (!user)
        return (<FullScreenLoader></FullScreenLoader>);
    const name = user.Fullname;
    const email = user.Email;
    const client = user.Client;
    const applications = user.Applications;
  

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setAvatarPreview(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!selectedFile) return;

        setUploading(true);
        const data: UpdateAvatarDto = {
            Avatar: selectedFile,
        };
        const formToSend = buildFormData(data as Record<string, any>);

        var response = await updateAvatarAsync(formToSend);
        if (response.Success) {
            showToast('Avatar updated successfully', 'success', {
                autoClose: 5000,
                draggable: true
            });
            setSelectedFile(null);
            refreshUser();
        }
        else {
            showToast(response.Message, response.ResponseType, {
                autoClose: 3000,
                draggable: true
            });
        }
        setUploading(false);

    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div
                className="shadow-lg rounded p-4 bg-white"
                style={{ maxWidth: 500, width: "100%" }}
            >
                <h2 className="text-center mb-4">My Profile</h2>

                <div
                    className="rounded-circle mx-auto mb-3"
                    style={{
                        width: 150,
                        height: 150,
                        overflow: "hidden",
                        border: "4px solid #0d6efd",
                        backgroundColor: "#f0f0f0",
                    }}
                >
                    <img
                        src={user.AvatarBase64 ?? avatarPreview}
                        alt="Avatar"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>

                <div className="text-center mb-3">
                    <label
                        htmlFor="avatarInput"
                        className="btn btn-outline-primary btn-sm"
                        style={{ cursor: "pointer" }}
                    >
                        Choose New Avatar
                    </label>
                    <input
                        id="avatarInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        disabled={uploading}
                    />
                </div>

                <button
                    className="btn btn-primary w-100 mb-3"
                    onClick={handleSave}
                    disabled={!selectedFile || uploading}
                >
                    {uploading ? "Saving..." : "Save Avatar"}
                </button>

                <ul className="list-unstyled fs-5">
                    <li>
                        <strong>Name:</strong> <small> {name}</small>
                    </li>
                    <li>
                        <strong>Email:</strong> <small>{email}</small> 
                    </li>
                    <li>
                        <strong>Client:</strong> <small>{client}</small>
                    </li>
                    <li>
                        <strong>Applications:</strong><small>{applications.join(", ")}</small> 
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ConsumerProfilePage;
