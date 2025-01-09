import React from 'react';
import Image from 'next/image';

interface UserModalProps {
  users: { id: string; firstName: string; lastName: string; profileImageURL: string }[];
  isOpen: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ users, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.classList.contains('backdrop')) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop bg-black bg-opacity-50 flex justify-center items-center z-50" 
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Users</h2>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
          &times;
        </button>
        <ul className="space-y-4">
          {users.map(user => (
            <li key={user.id} className="flex items-center gap-3">
              <Image src={user.profileImageURL} alt={`${user.firstName} ${user.lastName}`} width={40} height={40} className="rounded-full" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserModal;
