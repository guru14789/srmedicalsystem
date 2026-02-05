import React, { useState, useEffect } from 'react';
import { firebaseService } from '@/lib/firebaseService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Shield, User as UserIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    
    const interval = setInterval(() => {
      fetchUsers();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await firebaseService.getAllUsers();
      console.log('Fetched users:', response);
      if (response.success) {
        setUsers(response.data || []);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load users",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (uid, newRole) => {
    try {
      console.log('Updating user role:', uid, newRole);
      const response = await firebaseService.updateUserRole(uid, newRole);
      console.log('Update response:', response);

      if (response.success) {
        toast({
          title: "Role updated",
          description: "User role updated successfully"
        });
        await fetchUsers();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update user role",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Users</CardTitle>
            <CardDescription className="text-sm">Manage registered customers and admins</CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs sm:text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {users.length} Total
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchUsers()}
              disabled={loading}
              className="text-xs sm:text-sm"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No users yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div 
                key={user.uid || user.email} 
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 gap-3"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {(user.username || user.email)?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <h4 className="font-semibold text-sm sm:text-base truncate">
                        {user.username || user.name || 'No name'}
                      </h4>
                      <Badge
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={`${user.role === 'admin' ? 'bg-primary' : ''} text-xs`}
                      >
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <UserIcon className="h-3 w-3 mr-1" />
                            User
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
                    {user.phone && (
                      <p className="text-xs sm:text-sm text-gray-500">{user.phone}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3 sm:ml-3">
                  <Select
                    value={user.role || 'user'}
                    onValueChange={(value) => updateUserRole(user.uid, value)}
                  >
                    <SelectTrigger className="w-full sm:w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserList;
