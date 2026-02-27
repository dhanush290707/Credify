import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../card';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addUser({
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      status: 'active'
    });

    toast.success('User added successfully!');
    setShowAddModal(false);
    e.currentTarget.reset();
  };

  const handleUpdateStatus = (userId, status) => {
    updateUser(userId, { status });
    toast.success('User status updated!');
  };

  const handleDeleteUser = (userId, userName) => {
    if (confirm(`Are you sure you want to delete ${userName}?`)) {
      deleteUser(userId);
      toast.success('User deleted successfully!');
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 md:px-6 py-3 rounded-lg hover:bg-primary/90 w-full sm:w-auto justify-center">
          
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg" />
            
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg">
            
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="lender">Lender</option>
            <option value="borrower">Borrower</option>
            <option value="analyst">Analyst</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">ID</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Email</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Role</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Created</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) =>
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="py-3 px-4 text-sm">{user.id}</td>
                  <td className="py-3 px-4 text-sm">{user.name}</td>
                  <td className="py-3 px-4 text-sm">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                    value={user.status}
                    onChange={(e) => handleUpdateStatus(user.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border-0 ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' :
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'}`
                    }>
                    
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm">{user.createdAt}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                      onClick={() => setEditingUser(user.id)}
                      className="p-1 hover:bg-secondary rounded"
                      title="Edit">
                      
                        <Edit2 size={16} />
                      </button>
                      <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="p-1 hover:bg-destructive/10 text-destructive rounded"
                      title="Delete">
                      
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 &&
          <div className="text-center py-8 text-muted-foreground">
              No users found matching your criteria
            </div>
          }
        </div>
      </Card>

      {/* Add User Modal */}
      {showAddModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3>Add New User</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Name</label>
                <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
              </div>
              
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
              </div>
              
              <div>
                <label className="block text-sm mb-2">Role</label>
                <select
                name="role"
                required
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
                
                  <option value="borrower">Borrower</option>
                  <option value="lender">Lender</option>
                  <option value="analyst">Analyst</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90">
                
                  Add User
                </button>
                <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-secondary px-6 py-2 rounded-lg hover:bg-secondary/80">
                
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        </div>
      }
    </div>);

}