import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  UserIcon, MailIcon, PhoneIcon, EditIcon, SaveIcon, XIcon,
  SettingsIcon, CrownIcon, UsersIcon, PackageIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase'; 

export const Profile = () => {
  const { user, role, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [editData, setEditData] = useState(userData);

  // ✅ Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      setLoadingData(true);

      try {
        const userRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            name: data.name || '',
            email: data.email || user.email || '',
            phoneNumber: data.phoneNumber || ''
          });
          setEditData({
            name: data.name || '',
            email: data.email || user.email || '',
            phoneNumber: data.phoneNumber || ''
          });
        } else {
          // create basic user doc if not exists
          await setDoc(userRef, {
            name: '',
            email: user.email || '',
            phoneNumber: '',
            role: 'user',
            uid: user.uid,
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) fetchUserData();
  }, [user]);

  const handleEdit = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Save to Firestore
  const handleSave = async () => {
    if (!user?.uid) return;

    try {
      const userRef = doc(db, 'Users', user.uid);
      await updateDoc(userRef, {
        name: editData.name,
        phoneNumber: editData.phoneNumber || ''
      });

      setUserData(editData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login', { replace: true });
  };

  if (!loading && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 pt-16 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary-100 p-4 rounded-full">
                  <UserIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h1>
                    {role && (
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          role === 'admin'
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {role === 'admin' ? (
                          <>
                            <CrownIcon className="h-4 w-4" /> Administrator
                          </>
                        ) : (
                          <>
                            <UserIcon className="h-4 w-4" /> Customer
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1 break-words">{user?.email}</p>
                </div>
              </div>

              {!isEditing && (
                <div className="flex flex-wrap items-center gap-3">
                  {role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:scale-105 transition"
                    >
                      <CrownIcon className="h-4 w-4 mr-2" /> Admin Portal
                    </button>
                  )}
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
                  >
                    <EditIcon className="h-4 w-4 mr-2" /> Edit
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h2>

              {isEditing ? (
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      readOnly
                      className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="text-sm text-gray-500">
                      UID: <span className="font-mono">{user?.uid?.slice(0, 8)}...</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                      >
                        <XIcon className="inline h-4 w-4 mr-1" /> Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                      >
                        <SaveIcon className="inline h-4 w-4 mr-1" /> Save
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900">{userData.name || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 break-all">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">{userData.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Tools */}
            {role === 'admin' && (
              <div className="space-y-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-sm p-6 border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <CrownIcon className="h-6 w-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-900">Admin Tools</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Admin Dashboard', path: '/admin', icon: SettingsIcon },
                    { label: 'Manage Products', path: '/admin/products', icon: PackageIcon },
                    { label: 'Manage Users', path: '/admin/customers', icon: UsersIcon },
                    { label: 'Manage Orders', path: '/admin/orders', icon: PackageIcon }
                  ].map((tool, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(tool.path)}
                      className="w-full flex items-center justify-between p-3 bg-white hover:bg-orange-50 rounded-lg border border-orange-200 transition"
                    >
                      <div className="flex items-center gap-3">
                        <tool.icon className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-900">{tool.label}</span>
                      </div>
                      <span className="text-orange-600">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
