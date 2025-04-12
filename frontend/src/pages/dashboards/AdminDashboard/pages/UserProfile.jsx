import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/getUserDetails/${userId}`);
      setUser(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch user details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // await axios.delete(`http://localhost:8000/api/users/${userId}`);
        toast.success("User deleted successfully");
        navigate("/admin/users");
      } catch (error) {
        toast.error("Failed to delete user");
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <Button variant="destructive" onClick={handleDeleteUser}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={user.profile_image}
              alt={user.fullName}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone_no}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <p>Age: {user.age}</p>
              <p>Gender: {user.gender}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Address</h3>
            <p>{user.address.street}</p>
            <p>
              {user.address.city}, {user.address.state} - {user.address.pincode}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Account Information</h3>
            <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
            <p>Last Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
