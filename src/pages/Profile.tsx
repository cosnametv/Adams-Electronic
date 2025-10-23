import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { UserIcon, MailIcon, PhoneIcon, EditIcon, SaveIcon, XIcon, SettingsIcon, CrownIcon, UsersIcon, PackageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, role, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: '',
    phone: '+254 700 123 456'
  });

  const [editData, setEditData] = useState(userData);

  const handleEdit = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login', { replace: true });
  };

  useEffect(() => {
    if (user?.email) {
      setUserData(prev => ({ ...prev, email: user.email || '' }));
      setEditData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  if (!loading && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-4 rounded-full">
                  <UserIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    {role && (
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        role === 'admin' 
                          ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200' 
                          : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200'
                      }`}>
                        {role === 'admin' ? (
                          <>
                            <CrownIcon className="h-4 w-4" />
                            Administrator
                          </>
                        ) : (
                          <>
                            <UserIcon className="h-4 w-4" />
                            Customer
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{user?.email || 'Signed in user'}</p>
                </div>
              </div>
              {!isEditing && (
                <div className="flex items-center gap-3">
                  {role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <CrownIcon className="h-5 w-5 mr-2" />
                      Admin Portal
                    </button>
                  )}
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                  >
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                
                {isEditing ? (
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={editData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={editData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>


                    <div className="flex justify-between space-x-4">
                      <div className="text-sm text-gray-500 flex items-center">UID: <span className="ml-1 font-mono text-gray-700">{user?.uid?.slice(0, 8)}...</span></div>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <XIcon className="h-4 w-4 mr-2 inline" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                      >
                        <SaveIcon className="h-4 w-4 mr-2 inline" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium text-gray-900">{userData.firstName} {userData.lastName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MailIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{user?.email || userData.email}</p>
                        </div>
                      </div>
                    </div>

                     <div className="flex items-center space-x-3">
                       <PhoneIcon className="h-5 w-5 text-gray-400" />
                       <div>
                         <p className="text-sm text-gray-500">Phone</p>
                         <p className="font-medium text-gray-900">{userData.phone}</p>
                       </div>
                     </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Stats */}
            <div className="space-y-6">
              {/* Admin Section - Only show for admin users */}
              {role === 'admin' && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-sm p-6 border border-orange-200">
                  <div className="flex items-center gap-2 mb-4">
                    <CrownIcon className="h-6 w-6 text-orange-600" />
                    <h3 className="text-lg font-semibold text-orange-900">Administrator Tools</h3>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/admin')}
                      className="w-full flex items-center justify-between p-3 bg-white hover:bg-orange-50 rounded-lg transition-colors duration-200 border border-orange-200"
                    >
                      <div className="flex items-center gap-3">
                        <SettingsIcon className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-900">Admin Dashboard</span>
                      </div>
                      <span className="text-orange-600">→</span>
                    </button>
                    <button
                      onClick={() => navigate('/admin/products')}
                      className="w-full flex items-center justify-between p-3 bg-white hover:bg-orange-50 rounded-lg transition-colors duration-200 border border-orange-200"
                    >
                      <div className="flex items-center gap-3">
                        <PackageIcon className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-900">Manage Products</span>
                      </div>
                      <span className="text-orange-600">→</span>
                    </button>
                    <button
                      onClick={() => navigate('/admin/customers')}
                      className="w-full flex items-center justify-between p-3 bg-white hover:bg-orange-50 rounded-lg transition-colors duration-200 border border-orange-200"
                    >
                      <div className="flex items-center gap-3">
                        <UsersIcon className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-900">Manage Users</span>
                      </div>
                      <span className="text-orange-600">→</span>
                    </button>
                    <button
                      onClick={() => navigate('/admin/orders')}
                      className="w-full flex items-center justify-between p-3 bg-white hover:bg-orange-50 rounded-lg transition-colors duration-200 border border-orange-200"
                    >
                      <div className="flex items-center gap-3">
                        <PackageIcon className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-900">Manage Orders</span>
                      </div>
                      <span className="text-orange-600">→</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
