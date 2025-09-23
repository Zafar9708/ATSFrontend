
// import React, { useState, useEffect } from "react";
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
//     TextField,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Typography,
//     Divider,
//     Box,
//     Avatar
// } from "@mui/material";
// import axios from 'axios';

// const MoveCandidateForm = ({ open, onClose, candidate, onMoveComplete }) => {
//     const [newStage, setNewStage] = useState("");
//     const [stageOptions, setStageOptions] = useState([]);
//     const [rejectionTypes, setRejectionTypes] = useState([]);
//     const [comment, setComment] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [rejectionType, setRejectionType] = useState("");
//     const [showAddRejection, setShowAddRejection] = useState(false);
//     const [newRejectionType, setNewRejectionType] = useState("");

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const stagesResponse = await axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/stages/all');
//                 setStageOptions(stagesResponse.data);

//                 const rejectionResponse = await axios.get('https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/stages/rejection-types');
//                 setRejectionTypes(rejectionResponse.data);
//             } catch (err) {
//                 console.error("Error fetching data:", err);
//                 setError("Failed to load stage options");
//             }
//         };
//         fetchData();
//     }, []);

//     useEffect(() => {
//         if (candidate && stageOptions.length > 0) {
//             setNewStage(candidate.stage?._id || "");
//         }
//     }, [candidate, stageOptions]);

//     const handleAddRejectionType = async () => {
//         if (!newRejectionType.trim()) {
//             setError("Please enter a rejection type");
//             return;
//         }

//         try {
//             const response = await axios.post('https://hire-onboardbackend-production.up.railway.app/api/stages/rejection-types', {
//                 type: newRejectionType
//             });

//             setRejectionTypes([...rejectionTypes, newRejectionType]);
//             setRejectionType(newRejectionType);
//             setNewRejectionType("");
//             setShowAddRejection(false);
//         } catch (err) {
//             console.error(err);
//             setError(err.response?.data?.error || "Failed to add rejection type");
//         }
//     };

//     const handleSubmit = async () => {
//         if (!candidate?._id) {
//             setError("Candidate ID is missing.");
//             return;
//         }

//         if (!newStage) {
//             setError("Please select a new stage");
//             return;
//         }

//         const selectedStage = stageOptions.find(stage => stage._id === newStage);
//         const isRejectedStage = selectedStage?.name === "Rejected";

//         if (isRejectedStage && !rejectionType) {
//             setError("Please select or add a rejection type");
//             return;
//         }

//         setLoading(true);
//         setError("");

//         try {
//             const response = await axios.put(`https://hire-onboardbackend-production.up.railway.app/api/candidates/${candidate._id}/stage`, {
//                 stage: newStage,
//                 comment,
//                 ...(isRejectedStage && { rejectionType })
//             });

//             if (onMoveComplete) {
//                 onMoveComplete(response.data.candidate);
//             }

//             onClose();
//             setRejectionType("");
//             setShowAddRejection(false);
//             setComment("");
//         } catch (err) {
//             console.error(err);
//             setError(err.response?.data?.error || "Something went wrong while moving the candidate.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!candidate) return null;

//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//             <DialogTitle>Move Candidate</DialogTitle>
//             <DialogContent>
//                 <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
//                         {candidate.firstName?.charAt(0)}
//                     </Avatar>
//                     <Typography variant="h6">
//                         {`${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`}
//                     </Typography>
//                 </Box>

//                 <Divider sx={{ my: 2 }} />

//                 <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Stage</Typography>
//                 <TextField
//                     value={candidate.stage?.name || "Sourced"}
//                     fullWidth
//                     margin="normal"
//                     disabled
//                     sx={{ mb: 3 }}
//                 />

//                 <Typography variant="subtitle2" sx={{ mb: 1 }}>Select New Stage</Typography>
//                 <FormControl fullWidth margin="normal">
//                     <InputLabel>New Stage</InputLabel>
//                     <Select
//                         value={newStage}
//                         onChange={(e) => {
//                             setNewStage(e.target.value);
//                             const selected = stageOptions.find(stage => stage._id === e.target.value);
//                             if (selected?.name !== "Rejected") {
//                                 setRejectionType("");
//                                 setShowAddRejection(false);
//                             }
//                         }}
//                         label="New Stage"
//                     >
//                         {stageOptions.map((option) => (
//                             <MenuItem key={option._id} value={option._id}>
//                                 {option.name}
//                             </MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>

//                 {stageOptions.find(stage => stage._id === newStage)?.name === "Rejected" && (
//                     <>
//                         <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
//                             Rejection Type
//                         </Typography>
//                         <FormControl fullWidth margin="normal">
//                             <InputLabel>Select rejection type</InputLabel>
//                             <Select
//                                 value={rejectionType}
//                                 onChange={(e) => {
//                                     if (e.target.value === '__add__') {
//                                         setShowAddRejection(true);
//                                     } else {
//                                         setRejectionType(e.target.value);
//                                     }
//                                 }}
//                                 label="Select rejection type"
//                             >
//                                 {rejectionTypes.map((type) => (
//                                     <MenuItem key={type} value={type}>
//                                         {type}
//                                     </MenuItem>
//                                 ))}
//                                 <MenuItem value="__add__" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
//                                     + Add New Rejection Type
//                                 </MenuItem>
//                             </Select>
//                         </FormControl>

//                         {showAddRejection && (
//                             <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
//                                 <TextField
//                                     fullWidth
//                                     value={newRejectionType}
//                                     onChange={(e) => setNewRejectionType(e.target.value)}
//                                     label="New Rejection Type"
//                                     variant="outlined"
//                                 />
//                                 <Button
//                                     variant="contained"
//                                     onClick={handleAddRejectionType}
//                                     disabled={!newRejectionType.trim()}
//                                 >
//                                     Add
//                                 </Button>
//                                 <Button
//                                     variant="outlined"
//                                     onClick={() => {
//                                         setShowAddRejection(false);
//                                         setNewRejectionType("");
//                                     }}
//                                 >
//                                     Cancel
//                                 </Button>
//                             </Box>
//                         )}
//                     </>
//                 )}

//                 <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
//                     Comment {stageOptions.find(stage => stage._id === newStage)?.name !== "Rejected" && "(Optional)"}
//                 </Typography>
//                 <TextField
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     fullWidth
//                     multiline
//                     rows={3}
//                     margin="normal"
//                     placeholder="Add comment about this stage change..."
//                 />

//                 {error && (
//                     <Typography color="error" sx={{ mt: 2 }}>
//                         {error}
//                     </Typography>
//                 )}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose}>Cancel</Button>
//                 <Button
//                     onClick={handleSubmit}
//                     variant="contained"
//                     disabled={loading || !newStage ||
//                         (stageOptions.find(stage => stage._id === newStage)?.name === "Rejected" && !rejectionType)
//                     }
//                 >
//                     {loading ? "Moving..." : "Move"}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default MoveCandidateForm;

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Divider,
    Box,
    Avatar,
    CircularProgress
} from "@mui/material";
import axios from 'axios';

// Use a consistent base URL
const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1';

const MoveCandidateForm = ({ open, onClose, candidate, onMoveComplete }) => {
    const [newStage, setNewStage] = useState("");
    const [stageOptions, setStageOptions] = useState([]);
    const [rejectionTypes, setRejectionTypes] = useState([]);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [rejectionType, setRejectionType] = useState("");
    const [showAddRejection, setShowAddRejection] = useState(false);
    const [newRejectionType, setNewRejectionType] = useState("");
    const [fetchLoading, setFetchLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!open) return;

            // Reset states when dialog opens
            setSuccess(false);
            setError("");
            setFetchLoading(true);
            
            try {
                // Fetch stages
                const stagesResponse = await axios.get(`${API_BASE_URL}/stages/all`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                // Handle different response structures
                let stagesData = [];
                if (Array.isArray(stagesResponse.data)) {
                    stagesData = stagesResponse.data;
                } else if (stagesResponse.data.data && Array.isArray(stagesResponse.data.data)) {
                    stagesData = stagesResponse.data.data;
                } else if (stagesResponse.data.stages && Array.isArray(stagesResponse.data.stages)) {
                    stagesData = stagesResponse.data.stages;
                }

                setStageOptions(stagesData);

                // Fetch rejection types
                const rejectionResponse = await axios.get(`${API_BASE_URL}/stages/rejection-types`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                // Handle different response structures for rejection types
                let rejectionData = [];
                if (Array.isArray(rejectionResponse.data)) {
                    rejectionData = rejectionResponse.data;
                } else if (rejectionResponse.data.data && Array.isArray(rejectionResponse.data.data)) {
                    rejectionData = rejectionResponse.data.data;
                } else if (rejectionResponse.data.types && Array.isArray(rejectionResponse.data.types)) {
                    rejectionData = rejectionResponse.data.types;
                }

                setRejectionTypes(rejectionData);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load stage options");
            } finally {
                setFetchLoading(false);
            }
        };

        fetchData();
    }, [open]);

    useEffect(() => {
        if (candidate && stageOptions.length > 0) {
            setNewStage(candidate.stage?._id || "");
        }
    }, [candidate, stageOptions]);

    const handleAddRejectionType = async () => {
        if (!newRejectionType.trim()) {
            setError("Please enter a rejection type");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/stages/rejection-types`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                },
                type: newRejectionType
            });

            // Update the rejection types list with the new type
            setRejectionTypes(prevTypes => [...prevTypes, newRejectionType]);
            setRejectionType(newRejectionType);
            setNewRejectionType("");
            setShowAddRejection(false);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to add rejection type");
        }
    };

    const handleSubmit = async () => {
        if (!candidate?._id) {
            setError("Candidate ID is missing.");
            return;
        }

        if (!newStage) {
            setError("Please select a new stage");
            return;
        }

        const selectedStage = stageOptions.find(stage => stage._id === newStage);
        const isRejectedStage = selectedStage?.name === "Rejected";

        if (isRejectedStage && !rejectionType) {
            setError("Please select or add a rejection type");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await axios.put(`${API_BASE_URL}/stages/move/${candidate._id}`, {
                stage: newStage,
                comment,
                ...(isRejectedStage && { rejectionType })
            });

            // Clear any previous errors and set success
            setError("");
            setSuccess(true);
            
            if (onMoveComplete) {
                onMoveComplete(response.data.candidate);
            }
            
            // Wait a moment to show success message before closing
            setTimeout(() => {
                handleClose();
            }, 1500);
            
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Something went wrong while moving the candidate.");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setNewStage("");
        setRejectionType("");
        setShowAddRejection(false);
        setComment("");
        setError("");
        setSuccess(false);
        setLoading(false);
        onClose();
    };

    if (!candidate) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Move Candidate</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>
                            Updating candidate stage...
                        </Typography>
                    </Box>
                ) : success ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200, flexDirection: "column" }}>
                        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                            Candidate moved successfully!
                        </Typography>
                        <Typography variant="body2">
                            The candidate has been moved to the new stage.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                                {candidate.firstName?.charAt(0)}
                            </Avatar>
                            <Typography variant="h6">
                                {`${candidate.firstName} ${candidate.middleName || ''} ${candidate.lastName}`}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {fetchLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 100 }}>
                                <CircularProgress size={24} sx={{ mr: 2 }} />
                                <Typography>Loading stages...</Typography>
                            </Box>
                        ) : (
                            <>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Stage</Typography>
                                <TextField
                                    value={candidate.stage?.name || "Sourced"}
                                    fullWidth
                                    margin="normal"
                                    disabled
                                    sx={{ mb: 3 }}
                                />

                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Select New Stage</Typography>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>New Stage</InputLabel>
                                    <Select
                                        value={newStage}
                                        onChange={(e) => {
                                            setNewStage(e.target.value);
                                            const selected = stageOptions.find(stage => stage._id === e.target.value);
                                            if (selected?.name !== "Rejected") {
                                                setRejectionType("");
                                                setShowAddRejection(false);
                                            }
                                        }}
                                        label="New Stage"
                                    >
                                        {Array.isArray(stageOptions) && stageOptions.length > 0 ? (
                                            stageOptions.map((option) => (
                                                <MenuItem key={option._id} value={option._id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No stages available</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>

                                {stageOptions.find(stage => stage._id === newStage)?.name === "Rejected" && (
                                    <>
                                        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                                            Rejection Type
                                        </Typography>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>Select rejection type</InputLabel>
                                            <Select
                                                value={rejectionType}
                                                onChange={(e) => {
                                                    if (e.target.value === '__add__') {
                                                        setShowAddRejection(true);
                                                    } else {
                                                        setRejectionType(e.target.value);
                                                    }
                                                }}
                                                label="Select rejection type"
                                            >
                                                {Array.isArray(rejectionTypes) && rejectionTypes.length > 0 ? (
                                                    rejectionTypes.map((type) => (
                                                        <MenuItem key={type} value={type}>
                                                            {type}
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem disabled>No rejection types available</MenuItem>
                                                )}
                                                <MenuItem value="__add__" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
                                                    + Add New Rejection Type
                                                </MenuItem>
                                            </Select>
                                        </FormControl>

                                        {showAddRejection && (
                                            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <TextField
                                                    fullWidth
                                                    value={newRejectionType}
                                                    onChange={(e) => setNewRejectionType(e.target.value)}
                                                    label="New Rejection Type"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                                <Button
                                                    variant="contained"
                                                    onClick={handleAddRejectionType}
                                                    disabled={!newRejectionType.trim()}
                                                    size="small"
                                                >
                                                    Add
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setShowAddRejection(false);
                                                        setNewRejectionType("");
                                                    }}
                                                    size="small"
                                                >
                                                    Cancel
                                                </Button>
                                            </Box>
                                        )}
                                    </>
                                )}

                                <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                                    Comment {stageOptions.find(stage => stage._id === newStage)?.name !== "Rejected" && "(Optional)"}
                                </Typography>
                                <TextField
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    margin="normal"
                                    placeholder="Add comment about this stage change..."
                                />
                            </>
                        )}

                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    {success ? 'Close' : 'Cancel'}
                </Button>
                {!success && (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || !newStage || fetchLoading ||
                            (stageOptions.find(stage => stage._id === newStage)?.name === "Rejected" && !rejectionType)
                        }
                    >
                        {loading ? <CircularProgress size={24} /> : "Move"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default MoveCandidateForm;