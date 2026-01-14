import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PosterUpload.css';
import './Pricing.css';

export default function PosterUpload() {
    const locationState = useLocation();
    const plan = locationState.state?.plan || { posts: 999, price: 0 }; // Unlimited access by default

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [history, setHistory] = useState([]); // Array to store upload history
    const [manualLocation, setManualLocation] = useState('');

    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    // New State for Offer Details
    const [description, setDescription] = useState('');
    const [offerRate, setOfferRate] = useState('');
    const [offerPeriod, setOfferPeriod] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    // Fetch existing uploads
    React.useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/upload/my-posts', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const mappedHistory = data.map(post => ({
                        id: post.id,
                        name: "Uploaded Poster", // Generic name as we don't store original filename in DB
                        preview: post.image_url,
                        video: post.video_url ? "Uploaded Video" : null,
                        videoPreview: post.video_url, // For now, use URL directly if supported or just show badge
                        description: post.description,
                        offerRate: post.offer_price,
                        offerPeriod: post.offer_period,
                        date: new Date(post.created_at).toLocaleDateString(),
                        location: " Link Provided",
                        locationDetails: post.location,
                        status: post.status === 'EXPIRED' ? 'EXPIRED' : post.approval_status
                    }));
                    setHistory(mappedHistory);
                }
            } catch (err) {
                console.error("Failed to load history", err);
            }
        };
        fetchHistory();
    }, []);

    // Derived state
    const uploadsCount = history.length;
    const remainingUploads = plan.posts - uploadsCount;

    // Handle Drag & Drop for Poster
    const [isDragOver, setIsDragOver] = useState(false);
    const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
    const handleDragLeave = () => setIsDragOver(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) handleFile(file);
    };

    // Handle Drag & Drop for Video
    const [isVideoDragOver, setIsVideoDragOver] = useState(false);
    const handleVideoDragOver = (e) => { e.preventDefault(); setIsVideoDragOver(true); };
    const handleVideoDragLeave = () => setIsVideoDragOver(false);
    const handleVideoDrop = (e) => {
        e.preventDefault();
        setIsVideoDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) handleVideoFile(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) handleVideoFile(file);
    };

    const handleFile = (file) => {
        if (remainingUploads <= 0) {
            alert("You have reached your upload limit for this plan!");
            return;
        }
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleVideoFile = (file) => {
        if (remainingUploads <= 0) {
            alert("You have reached your upload limit for this plan!");
            return;
        }
        setVideo(file);
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async () => {
        if (!image) return alert("Please upload a poster first.");

        if (!description || !offerRate || !offerPeriod || !expiryDate) {
            return alert("Please fill in all offer details including expiry date.");
        }

        if (!manualLocation) {
            alert("Please paste a Google Maps location link.");
            return;
        }

        setIsUploading(true);

        try {
            // 1. Upload Image
            const imageFormData = new FormData();
            imageFormData.append('image', image);

            const imageRes = await fetch('http://localhost:5000/api/upload/image', {
                method: 'POST',
                body: imageFormData,
            });
            const imageData = await imageRes.json();
            if (!imageRes.ok) throw new Error(imageData.error || 'Image upload failed');

            // 2. Upload Video (if exists)
            let videoData = {};
            if (video) {
                const videoFormData = new FormData();
                videoFormData.append('video', video);

                const videoRes = await fetch('http://localhost:5000/api/upload/video', {
                    method: 'POST',
                    body: videoFormData,
                });
                videoData = await videoRes.json();
                if (!videoRes.ok) throw new Error(videoData.error || 'Video upload failed');
            }

            // 3. Create Post in Database
            const postPayload = {
                description,
                imageUrl: imageData.url,
                videoUrl: videoData.cloudinary_url || '',
                videoAssetId: videoData.mux_asset_id || '',
                location: manualLocation,
                offerPrice: offerRate,
                offerPeriod: offerPeriod,
                expiryDate: expiryDate
            };

            const createRes = await fetch('http://localhost:5000/api/upload/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(postPayload),
            });

            const createData = await createRes.json();
            if (!createRes.ok) throw new Error(createData.error || 'Failed to save post');

            // Add to history (UI update)
            const newUpload = {
                id: createData._id || Date.now(),
                name: image.name,
                preview: preview,
                video: video ? video.name : null,
                videoPreview: videoPreview,
                description,
                offerRate,
                offerPeriod,
                date: new Date().toLocaleDateString(),
                location: " Link Provided",
                locationDetails: manualLocation,
                status: createData.approval_status || "Pending Approval"
            };

            setHistory([newUpload, ...history]);

            // Reset form
            setImage(null);
            setPreview(null);
            setVideo(null);
            setVideoPreview(null);
            setManualLocation('');
            setDescription('');
            setOfferRate('');
            setOfferPeriod('');
            setExpiryDate('');

            alert("Content Submitted and Saved Successfully!");

        } catch (error) {
            console.error('Upload Error:', error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-page-wrapper" style={{ minHeight: '100vh', padding: '40px 20px' }}>

            {/* Top Section: Plan Info */}
            <div className="plan-status-bar">
                <div className="status-text">
                    <h3>Subscription: {plan.posts} Posts Plan</h3>
                </div>
                <div className="limit-badge">
                    Remaining: <strong>{remainingUploads}</strong> / {plan.posts}
                </div>
            </div>

            <div className="upload-container">
                <h1>Create New Post</h1>
                <p>Fill in the details below to publish your offer.</p>

                <div className="upload-grid-layout">

                    {/* Card 1: Poster Upload */}
                    <div className="upload-card">
                        <div className="card-header">
                            <h3>1. Upload Poster</h3>
                        </div>
                        <div className="card-body">
                            {remainingUploads > 0 ? (
                                <label
                                    className={`upload-dropzone compact ${isDragOver ? 'active' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <input type="file" accept="image/*" onChange={handleFileChange} />

                                </label>
                            ) : (
                                <div className="limit-reached-message">Limit Reached</div>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Video Upload */}
                    <div className="upload-card">
                        <div className="card-header">
                            <h3>2. Upload Video (Optional)</h3>
                        </div>
                        <div className="card-body">
                            {remainingUploads > 0 && (
                                <label
                                    className={`upload-dropzone compact ${isVideoDragOver ? 'active' : ''}`}
                                    onDragOver={handleVideoDragOver}
                                    onDragLeave={handleVideoDragLeave}
                                    onDrop={handleVideoDrop}
                                >
                                    <input type="file" accept="video/*" onChange={handleVideoChange} />

                                </label>
                            )}
                        </div>
                    </div>

                    {/* Card 3: Description */}
                    <div className="upload-card full-width">
                        <div className="card-header">
                            <h3>3. Offer Description</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Description about the offer</label>
                                <textarea
                                    placeholder="Describe your offer in detail..."
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="text-input"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Offer Rate */}
                    <div className="upload-card">
                        <div className="card-header">
                            <h3>4. Offer Rate</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Rate (₹ or %)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 50% OFF or ₹999"
                                    value={offerRate}
                                    onChange={(e) => setOfferRate(e.target.value)}
                                    className="text-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 5: Offer Period */}
                    <div className="upload-card">
                        <div className="card-header">
                            <h3>5. Offer Period</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Validity Period</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Valid till 31st Dec"
                                    value={offerPeriod}
                                    onChange={(e) => setOfferPeriod(e.target.value)}
                                    className="text-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 6: Location */}
                    <div className="upload-card full-width">
                        <div className="card-header">
                            <h3>6. Location</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Google Maps Link</label>
                                <input
                                    type="text"
                                    placeholder="Paste Google Maps Link here..."
                                    value={manualLocation}
                                    onChange={(e) => setManualLocation(e.target.value)}
                                    disabled={remainingUploads <= 0}
                                    className="text-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 7: Expiry Date */}
                    <div className="upload-card full-width">
                        <div className="card-header">
                            <h3>7. Offer Expiry Date</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Expiry Date and Time</label>
                                <input
                                    type="datetime-local"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    disabled={remainingUploads <= 0}
                                    className="text-input"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="submit-section">
                    <button className="btn-primary" onClick={handleSubmit} disabled={!image || remainingUploads <= 0 || !manualLocation || !description || isUploading}>
                        {isUploading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </div>

            {/* Bottom Section: History */}
            <div className="history-section">
                <h2>Upload History</h2>
                {history.length === 0 ? (
                    <p className="no-history">No uploads yet.</p>
                ) : (
                    <div className="history-grid">
                        {history.map(item => (
                            <div key={item.id} className="history-card">
                                <img src={item.preview} alt="poster" />
                                <div className="history-info">
                                    <h4>{item.name}</h4>
                                    {item.video && <span className="video-badge">🎥 Video</span>}
                                    <p className="history-desc">{item.description?.substring(0, 50)}...</p>
                                    <div className="history-meta">
                                        <span>🏷️ {item.offerRate}</span>
                                        <span>📅 {item.offerPeriod}</span>
                                    </div>
                                    <div className="history-footer">
                                        <span>{item.date}</span>
                                        <a href={item.locationDetails} target="_blank" rel="noopener noreferrer">Map ↗</a>
                                    </div>
                                    <span className="status-badge">{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
