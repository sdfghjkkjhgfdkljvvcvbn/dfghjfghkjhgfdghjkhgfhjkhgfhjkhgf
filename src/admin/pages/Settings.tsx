import React, { useState, useEffect } from 'react';
import { Lock, Mail, Phone, MapPin, Instagram, Facebook, Save, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useUIStore } from '../store/uiStore';
import { supabase } from '../services/supabaseClient';

export const Settings: React.FC = () => {
  const { addNotification } = useUIStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile & Account
  const [adminName, setAdminName] = useState('Admin User');
  const [adminEmail, setAdminEmail] = useState('admin@parbatiinterior.com');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  // Website Information
  const [websiteName, setWebsiteName] = useState('Parbati Interior');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');

  // Appearance
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Notifications
  const [notifyNewEnquiries, setNotifyNewEnquiries] = useState(true);
  const [notifyBookings, setNotifyBookings] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (!error && data) {
        // Parse stored settings
        data.forEach((setting: any) => {
          const value = setting.value;
          if (setting.key === 'website_info') {
            setWebsiteName(value.name || 'Parbati Interior');
            setPhone(value.phone || '');
            setEmail(value.email || '');
            setAddress(value.address || '');
            setInstagram(value.instagram || '');
            setFacebook(value.facebook || '');
          } else if (setting.key === 'appearance') {
            setTheme(value.theme || 'system');
          } else if (setting.key === 'notifications') {
            setNotifyNewEnquiries(value.newEnquiries !== false);
            setNotifyBookings(value.bookings !== false);
          }
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWebsiteInfo = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'website_info',
            value: { name: websiteName, phone, email, address, instagram, facebook },
          },
          { onConflict: 'key' }
        );

      if (error) throw error;
      addNotification({ type: 'success', message: 'Website information saved' });
    } catch (error) {
      console.error('Error saving website info:', error);
      addNotification({ type: 'error', message: 'Failed to save website information' });
    } finally {
      setSaving(false);
    }
  };

  const saveAppearance = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          { key: 'appearance', value: { theme } },
          { onConflict: 'key' }
        );

      if (error) throw error;
      addNotification({ type: 'success', message: 'Appearance settings saved' });
    } catch (error) {
      console.error('Error saving appearance:', error);
      addNotification({ type: 'error', message: 'Failed to save appearance settings' });
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'notifications',
            value: { newEnquiries: notifyNewEnquiries, bookings: notifyBookings },
          },
          { onConflict: 'key' }
        );

      if (error) throw error;
      addNotification({ type: 'success', message: 'Notification settings saved' });
    } catch (error) {
      console.error('Error saving notifications:', error);
      addNotification({ type: 'error', message: 'Failed to save notification settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      addNotification({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({ password: passwordData.new });

      if (error) throw error;
      addNotification({ type: 'success', message: 'Password updated successfully' });
      setPasswordData({ current: '', new: '', confirm: '' });
      setShowPasswordForm(false);
    } catch (error: any) {
      addNotification({ type: 'error', message: 'Failed to update password' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and website preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. PROFILE & ACCOUNT */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-600" />
                <div>
                  <h2 className="font-semibold text-gray-900">Profile & Account</h2>
                  <p className="text-xs text-gray-500">Manage your admin account</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Admin Name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                disabled
              />
              <Input
                label="Email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                disabled
              />
              
              {!showPasswordForm ? (
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
              ) : (
                <div className="space-y-3 border-t pt-4">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={handleChangePassword}
                      disabled={saving}
                      className="flex-1 gap-2"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowPasswordForm(false)}
                      disabled={saving}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* 2. WEBSITE INFORMATION */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-600" />
                <div>
                  <h2 className="font-semibold text-gray-900">Website Information</h2>
                  <p className="text-xs text-gray-500">Basic business details</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <Input
                label="Website Name"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
              />
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+977 985 1234567"
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@parbatiinterior.com"
              />
              <Input
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, Country"
              />
              <Input
                label="Instagram URL"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/parbatiinterior"
              />
              <Input
                label="Facebook URL"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/parbatiinterior"
              />
              <Button
                variant="primary"
                onClick={saveWebsiteInfo}
                disabled={saving}
                className="w-full gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </CardBody>
          </Card>

          {/* 3. APPEARANCE */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-red-600">🎨</div>
                <div>
                  <h2 className="font-semibold text-gray-900">Appearance</h2>
                  <p className="text-xs text-gray-500">Visual preferences</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Theme</label>
                <div className="space-y-2">
                  {['light', 'dark', 'system'].map((t) => (
                    <label key={t} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={t}
                        checked={theme === t}
                        onChange={() => setTheme(t as any)}
                        className="w-4 h-4 accent-red-600"
                      />
                      <span className="text-sm text-gray-700 capitalize">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button
                variant="primary"
                onClick={saveAppearance}
                disabled={saving}
                className="w-full gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </CardBody>
          </Card>

          {/* 4. NOTIFICATIONS */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-red-600">🔔</div>
                <div>
                  <h2 className="font-semibold text-gray-900">Notifications</h2>
                  <p className="text-xs text-gray-500">Alert preferences</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">New Enquiries</p>
                  <p className="text-xs text-gray-500">Get notified of new enquiries</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyNewEnquiries}
                    onChange={(e) => setNotifyNewEnquiries(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Booking Notifications</p>
                  <p className="text-xs text-gray-500">Get notified of new bookings</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyBookings}
                    onChange={(e) => setNotifyBookings(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <Button
                variant="primary"
                onClick={saveNotifications}
                disabled={saving}
                className="w-full gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </CardBody>
          </Card>

        </div>

        {/* 5. SECURITY - Full width */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-red-600" />
              <div>
                <h2 className="font-semibold text-gray-900">Security</h2>
                <p className="text-xs text-gray-500">Manage security settings and sessions</p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Password</p>
                <p className="text-xs text-gray-500 mb-3">Your password is securely stored</p>
                <Button variant="secondary" className="w-full" disabled>
                  Password Protected ✓
                </Button>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Session</p>
                <p className="text-xs text-gray-500 mb-3">You are currently logged in</p>
                <Button variant="danger" className="w-full" onClick={() => window.location.href = '/admin/logout'}>
                  Logout
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

      </div>
    </DashboardLayout>
  );
};
