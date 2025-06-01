// 'use client';

// import {
//   Box,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   Container,
//   Paper,
//   Avatar,
//   IconButton,
//   Divider,
// } from '@mui/material';
// import { useEffect, useState } from 'react';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Cancel';

// const sexes = ['Male', 'Female', 'Other'];
// const bodyShapes = ['Athletic', 'Lean', 'Muscular', 'Toned', 'Bulky'];

// const textFieldStyles = {
//   borderRadius: 2,
//   '& .MuiOutlinedInput-root': {
//     borderRadius: 2,
//     boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
//     transition: 'box-shadow 0.3s ease',
//     '&:hover fieldset': {
//       borderColor: '#f44336',
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: '#f44336',
//       boxShadow: '0 0 8px #f44336',
//     },
//   },
// };

// export default function ProfilePage() {
//   const [profile, setProfile] = useState({
    // name: '',
    // age: '',
    // sex: '',
    // address: "",
    // height: '',
    // weight: '',
    // bodyShape: '',
    // notes: '',
//   });

//   const [editMode, setEditMode] = useState(false);

//   // Fetch name from localStorage on mount
//   useEffect(() => {
//     const storedName = localStorage.getItem('name');
//     if (storedName) {
//       setProfile((prev) => ({ ...prev, name: storedName }));
//     }
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setProfile({ ...profile, [name]: value });
//   };

// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Ensure numeric fields are numbers or null before sending
//       const payload = {
//         ...profile,
//         age: profile.age === '' ? null : Number(profile.age),
//         height: profile.height === '' ? null : Number(profile.height),
//         weight: profile.weight === '' ? null : Number(profile.weight),
//       };

//       const res = await fetch('/api/auth/profile', { // This is your POST request
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || 'Failed to save profile.');
//       }

//       // Update local storage with the new name if it changes
//       if (profile.name) {
//         localStorage.setItem('name', profile.name);
//       }

//       setEditMode(false);
//       alert('Profile saved successfully!');
//     } catch (err: any) {
//       console.error('Error saving profile:', err);
//       setError(err.message || 'Failed to save profile. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isProfileEmpty = !profile.name;

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         backgroundImage: `url('/bgimage.jpg')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         position: 'relative',
//         pt: 8,
//         pb: 8,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     >
//       {/* Overlay */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           bgcolor: 'rgba(0,0,0,0.5)',
//           backdropFilter: 'blur(4px)',
//           zIndex: 1,
//         }}
//       />

//       <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             borderRadius: 3,
//             bgcolor: 'rgba(255, 255, 255, 0.7)',
//             position: 'relative',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           {/* Edit button top right */}
//           <IconButton
//             onClick={() => setEditMode(!editMode)}
//             sx={{ position: 'absolute', top: 16, right: 16 }}
//             aria-label={editMode ? 'Cancel editing' : 'Edit profile'}
//             color={editMode ? 'error' : 'primary'}
//           >
//             {editMode ? <CancelIcon /> : <EditIcon />}
//           </IconButton>

//           <Avatar
//             alt="Profile Picture"
//             src="/avatar.jpg"
//             sx={{
//               width: 120,
//               height: 120,
//               border: '3px solid #f44336',
//               mb: 3,
//             }}
//           />

//           <Typography variant="h4" gutterBottom textAlign="center">
//             {profile.name || 'Your Profile'}
//           </Typography>

//           {isProfileEmpty && !editMode && (
//             <Box textAlign="center" sx={{ mt: 2, mb: 3 }}>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 Add more details to your profile for a better experience.
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => setEditMode(true)}
//                 sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
//               >
//                 Add Details
//               </Button>
//             </Box>
//           )}

//           {editMode ? (
//             <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
//               <TextField
//                 label="Name"
//                 name="name"
//                 fullWidth
//                 value={profile.name}
//                 onChange={handleChange}
//                 margin="normal"
//                 required
//                 variant="outlined"
//                 sx={textFieldStyles}
//               />

//               {[ 
//                 { label: 'Age', name: 'age', type: 'number', required: true },
//                 { label: 'Height (cm)', name: 'height', type: 'number', required: true },
//                 { label: 'Weight (kg)', name: 'weight', type: 'number', required: true },
//               ].map(({ label, name, type, required }) => (
//                 <TextField
//                   key={name}
//                   label={label}
//                   name={name}
//                   type={type}
//                   fullWidth
//                   value={(profile as any)[name]}
//                   onChange={handleChange}
//                   margin="normal"
//                   required={required}
//                   variant="outlined"
//                   sx={{
//                     borderRadius: 2,
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: 2,
//                       boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
//                       transition: 'box-shadow 0.3s ease',
//                       '&:hover fieldset': {
//                         borderColor: '#f44336',
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: '#f44336',
//                         boxShadow: '0 0 8px #f44336',
//                       },
//                     },
//                   }}
//                 />
//               ))}

//               <TextField
//                 select
//                 label="Sex"
//                 name="sex"
//                 fullWidth
//                 value={profile.sex}
//                 onChange={handleChange}
//                 margin="normal"
//                 required
//                 variant="outlined"
//                 sx={{
//                   borderRadius: 2,
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
//                     transition: 'box-shadow 0.3s ease',
//                     '&:hover fieldset': {
//                       borderColor: '#f44336',
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#f44336',
//                       boxShadow: '0 0 8px #f44336',
//                     },
//                   },
//                 }}
//               >
//                 {sexes.map((option) => (
//                   <MenuItem key={option} value={option}>
//                     {option}
//                   </MenuItem>
//                 ))}
//               </TextField>

//                 <TextField
//                 label="Address"
//                 name="address"
//                 multiline
//                 rows={1}
//                 fullWidth
//                 value={profile.address}
//                 onChange={handleChange}
//                 margin="normal"
//                 variant="outlined"
//                 sx={{
//                   borderRadius: 2,
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
//                     transition: 'box-shadow 0.3s ease',
//                     '&:hover fieldset': {
//                       borderColor: '#f44336',
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#f44336',
//                       boxShadow: '0 0 8px #f44336',
//                     },
//                   },
//                 }}
//               />

//               <TextField
//                 select
//                 label="Preferred Body Shape"
//                 name="bodyShape"
//                 fullWidth
//                 value={profile.bodyShape}
//                 onChange={handleChange}
//                 margin="normal"
//                 required
//                 variant="outlined"
//                 sx={{
//                   borderRadius: 2,
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
//                     transition: 'box-shadow 0.3s ease',
//                     '&:hover fieldset': {
//                       borderColor: '#f44336',
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#f44336',
//                       boxShadow: '0 0 8px #f44336',
//                     },
//                   },
//                 }}
//               >
//                 {bodyShapes.map((shape) => (
//                   <MenuItem key={shape} value={shape}>
//                     {shape}
//                   </MenuItem>
//                 ))}
//               </TextField>

//               <TextField
//                 label="Goals / Notes"
//                 name="notes"
//                 multiline
//                 rows={4}
//                 fullWidth
//                 value={profile.notes}
//                 onChange={handleChange}
//                 margin="normal"
//                 variant="outlined"
//                 sx={{
//                   borderRadius: 2,
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                     boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
//                     transition: 'box-shadow 0.3s ease',
//                     '&:hover fieldset': {
//                       borderColor: '#f44336',
//                     },
//                     '&.Mui-focused fieldset': {
//                       borderColor: '#f44336',
//                       boxShadow: '0 0 8px #f44336',
//                     },
//                   },
//                 }}
//               />

//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 sx={{ mt: 3, bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
//                 startIcon={<SaveIcon />}
//               >
//                 Save Profile
//               </Button>
//             </Box>
//           ) : (
//             !isProfileEmpty && (
//               <Box sx={{ width: '100%', mt: 2 }}>
//                 <Typography variant="body1" gutterBottom>
//                   <strong>Name:</strong> {profile.name}
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   <strong>Age:</strong> {profile.age}
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   <strong>Sex:</strong> {profile.sex}
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                 <strong>Address:</strong> {profile.address}
//                 </Typography>

//                 <Typography variant="body1" gutterBottom>
//                   <strong>Height:</strong> {profile.height} cm
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   <strong>Weight:</strong> {profile.weight} kg
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                   <strong>Preferred Body Shape:</strong> {profile.bodyShape}
//                 </Typography>
//                 <Divider sx={{ my: 2 }} />
//                 <Typography variant="body1" gutterBottom>
//                   <strong>Goals / Notes:</strong>
//                 </Typography>
//                 <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
//                   {profile.notes || 'No notes added.'}
//                 </Typography>
//               </Box>
//             )
//           )}
//         </Paper>
//       </Container>
//     </Box>
//   );
// }

'use client';

import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Container,
  Paper,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useEffect, useState, useRef } from 'react'; // Import useRef
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Import CloudUploadIcon

const sexes = ['Male', 'Female', 'Other'];
const bodyShapes = ['Athletic', 'Lean', 'Muscular', 'Toned', 'Bulky'];

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    sex: '', // Corresponds to 'gender' in DB
    height: '',
    weight: '',
    bodyShape: '',
    notes: '',
    address: '',
  });

  const [profileImage, setProfileImage] = useState<string | null>(null); // State for the profile image URL (base64 or actual URL)
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/auth/profile');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch profile.');
        }

        setProfile({ 
          name: data.name || '',
          age: data.age !== null ? String(data.age) : '',
          sex: data.sex || '',
          height: data.height !== null ? String(data.height) : '',
          weight: data.weight !== null ? String(data.weight) : '',
          bodyShape: data.bodyshape || '',
          notes: data.notes || '',
          address: data.address || '',
        });
        setProfileImage(data.profileImageURL || '/person.jpg'); // Set image from fetched data or default

      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array means this runs once on mount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size exceeds 5MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // Store base64 string for preview
        setError(null); // Clear any previous errors
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...profile,
        age: profile.age === '' ? null : Number(profile.age),
        height: profile.height === '' ? null : Number(profile.height),
        weight: profile.weight === '' ? null : Number(profile.weight),
        profileImageURL: profileImage, // Send the current profileImage state
      };

      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save profile.');
      }

      // No need to update localStorage for name if it's fetched from API
      // localStorage.setItem('name', profile.name);

      setEditMode(false);
      alert('Profile saved successfully!');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    // Re-fetch original data to discard changes
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/auth/profile');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch profile.');
        }
        setProfile({
          name: data.name || '',
          age: data.age !== null ? String(data.age) : '',
          sex: data.sex || '',
          height: data.height !== null ? String(data.height) : '',
          weight: data.weight !== null ? String(data.weight) : '',
          bodyShape: data.bodyshape || '',
          notes: data.notes || '',
          address: data.address || '',
        });
        setProfileImage(data.profileImageURL || '/static/person.jpg');
      } catch (err: any) {
        console.error('Error fetching profile on cancel:', err);
        setError(err.message || 'Failed to revert profile. Please reload.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  };

  const isProfileEmpty = !profile.name && !profile.age && !profile.sex && !profile.height && !profile.weight && !profile.bodyShape && !profile.notes && !profile.address && !profileImage;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('/bgimage.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        pt: 8,
        pb: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1,
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {loading && (
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Edit/Cancel button top right */}
          <IconButton
            onClick={editMode ? handleCancel : () => setEditMode(true)}
            sx={{ position: 'absolute', top: 16, right: 16 }}
            aria-label={editMode ? 'Cancel editing' : 'Edit profile'}
            color={editMode ? 'error' : 'primary'}
            disabled={loading} // Disable during loading
          >
            {editMode ? <CancelIcon /> : <EditIcon />}
          </IconButton>

          {/* Avatar with Upload Functionality */}
          <Box
            sx={{
              position: 'relative',
              width: 120,
              height: 120,
              mb: 3,
              cursor: editMode ? 'pointer' : 'default',
              borderRadius: '50%',
              overflow: 'hidden',
              border: editMode ? '3px dashed #f44336' : '3px solid #f44336', // Dashed border in edit mode
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover .upload-overlay': {
                opacity: editMode ? 1 : 0, // Only show overlay on hover in edit mode
              },
            }}
            onClick={() => editMode && fileInputRef.current?.click()} // Only clickable in edit mode
          >
            <Avatar
              alt="Profile Picture"
              src={profileImage || '/person.jpg'} // Use profileImage or default
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {editMode && (
              <Box
                className="upload-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 40 }} />
                <Typography variant="caption">Upload Image</Typography>
              </Box>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }} // Hide the actual input
            />
          </Box>


          <Typography variant="h4" gutterBottom textAlign="center">
            {profile.name || 'Your Profile'}
          </Typography>

          {isProfileEmpty && !editMode && !loading && (
            <Box textAlign="center" sx={{ mt: 2, mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Add more details to your profile for a better experience.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
                sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
              >
                Add Details
              </Button>
            </Box>
          )}

          {editMode ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={profile.name}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#f44336',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f44336',
                      boxShadow: '0 0 8px #f44336',
                    },
                  },
                }}
              />

              {[
                { label: 'Age', name: 'age', type: 'number', required: true },
                { label: 'Height (cm)', name: 'height', type: 'number', required: true },
                { label: 'Weight (kg)', name: 'weight', type: 'number', required: true },
              ].map(({ label, name, type, required }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  type={type}
                  fullWidth
                  value={(profile as any)[name]}
                  onChange={handleChange}
                  margin="normal"
                  required={required}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                      transition: 'box-shadow 0.3s ease',
                      '&:hover fieldset': {
                        borderColor: '#f44336',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f44336',
                        boxShadow: '0 0 8px #f44336',
                      },
                    },
                  }}
                  InputProps={{ inputProps: { min: 0 } }} // Ensure non-negative input for numeric fields
                />
              ))}

              <TextField
                select
                label="Sex"
                name="sex"
                fullWidth
                value={profile.sex}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#f44336',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f44336',
                      boxShadow: '0 0 8px #f44336',
                    },
                  },
                }}
              >
                {sexes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              {/* ADDED: Address TextField below Sex */}
              <TextField
                label="Address"
                name="address"
                fullWidth
                multiline
                rows={2} // You can adjust rows as needed
                value={profile.address}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#f44336',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f44336',
                      boxShadow: '0 0 8px #f44336',
                    },
                  },
                }}
              />


              <TextField
                select
                label="Preferred Body Shape"
                name="bodyShape"
                fullWidth
                value={profile.bodyShape}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#f44336',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f44336',
                      boxShadow: '0 0 8px #f44336',
                    },
                  },
                }}
              >
                {bodyShapes.map((shape) => (
                  <MenuItem key={shape} value={shape}>
                    {shape}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Goals / Notes"
                name="notes"
                multiline
                rows={4}
                fullWidth
                value={profile.notes}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    boxShadow: '0 0 5px rgba(244, 67, 54, 0.3)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover fieldset': {
                      borderColor: '#f44336',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f44336',
                      boxShadow: '0 0 8px #f44336',
                    },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onSubmit={handleSubmit}
                sx={{ mt: 3, bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Save Profile
              </Button>
            </Box>
          ) : (
            !isProfileEmpty && !loading && ( // Only show if not empty and not loading
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Name:</strong> {profile.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Age:</strong> {profile.age}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Sex:</strong> {profile.sex}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Address:</strong> {profile.address || 'N/A'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Height:</strong> {profile.height} cm
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Weight:</strong> {profile.weight} kg
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Preferred Body Shape:</strong> {profile.bodyShape}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>Goals / Notes:</strong>
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {profile.notes || 'No notes added.'}
                </Typography>
              </Box>
            )
          )}
          {/* Show a message if profile is empty and not in edit mode, and not loading */}
          {isProfileEmpty && !editMode && !loading && !error && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Your profile is empty. Click the edit icon to add details.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}


