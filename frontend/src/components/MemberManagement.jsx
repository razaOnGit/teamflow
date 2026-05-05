import { useState, useEffect } from 'react';
import { Plus, X, UserPlus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const MemberManagement = ({ project, onMemberAdded, onMemberRemoved }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (showAddModal) {
      fetchAvailableUsers();
    }
  }, [showAddModal, project.id]);

  const fetchAvailableUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      
      // Filter out users who are already members
      const memberIds = project.members?.map(member => member.user.id) || [];
      const available = response.data.users.filter(user => 
        !memberIds.includes(user.id)
      );
      
      setAvailableUsers(available);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      const response = await api.post(`/projects/${project.id}/members`, {
        userId
      });
      
      onMemberAdded(response.data.member);
      setShowAddModal(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Failed to add member:', error);
      alert(error.response?.data?.error || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Are you sure you want to remove this member from the project?')) {
      return;
    }

    try {
      await api.delete(`/projects/${project.id}/members/${userId}`);
      onMemberRemoved(userId);
    } catch (error) {
      console.error('Failed to remove member:', error);
      alert(error.response?.data?.error || 'Failed to remove member');
    }
  };

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Add Member Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Team Members ({project.members?.length || 0})</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </button>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {project.members && project.members.length > 0 ? (
          project.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{member.user.name}</p>
                  <p className="text-sm text-gray-500">{member.user.email}</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {member.user.role}
                </span>
              </div>
              
              <button
                onClick={() => handleRemoveMember(member.user.id)}
                className="text-red-600 hover:text-red-800 p-1"
                title="Remove member"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>No members assigned to this project yet.</p>
            <p className="text-sm">Add team members to get started.</p>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Team Member</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full"
              />
            </div>

            {/* Users List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No available users found.</p>
                  {searchTerm && (
                    <p className="text-sm">Try adjusting your search terms.</p>
                  )}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {user.role}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleAddMember(user.id)}
                      className="btn-primary text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;