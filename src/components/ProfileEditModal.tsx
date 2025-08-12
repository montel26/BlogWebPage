import React, { useState } from 'react';
import { X, Upload, User, Save } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
}

const defaultProfile: UserProfile = {
  name: 'Ronel',
  bio: "Welcome to my review universe! I'm passionate about anime, movies, and books. Join me as I explore amazing stories and share honest opinions.",
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
};

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useLocalStorage<UserProfile>('userProfile', defaultProfile);
  const [formData, setFormData] = useState(profile);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setFormData(profile);
      setImagePreview('');
      setImageFile(null);
    }
  }, [isOpen, profile]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedProfile = {
      ...formData,
      avatar: imagePreview || formData.avatar
    };
    setProfile(updatedProfile);
    onClose();
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedProfile }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-pink-800 flex items-center gap-2">
            <User className="w-6 h-6" />
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-pink-400 hover:text-pink-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <img
                src={imagePreview || formData.avatar}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-pink-200"
              />
              <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600 transition-colors">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-pink-600">Click the upload icon to change your avatar</p>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-pink-800 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 text-pink-900"
              placeholder="Your display name"
            />
          </div>

          {/* Bio Input */}
          <div>
            <label className="block text-sm font-semibold text-pink-800 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 text-pink-900 resize-none"
              rows={4}
              placeholder="Tell visitors about yourself..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
