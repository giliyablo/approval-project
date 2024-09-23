import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [requests, setRequests] = useState([]);
    const [comments, setComments] = useState({});

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = () => {
        axios.get('http://localhost:3001/api/requests')
            .then(response => {
                console.log('Fetched Requests:', response.data); // Debugging line
                setRequests(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the requests!', error);
            });
    };

    const approveRequest = (id) => {
        const comment = comments[id] || '';
        axios.post(`http://localhost:3001/api/requests/${id}/approve`, { comment })
            .then(response => {
                console.log(response.data.message);
                fetchRequests();
            })
            .catch(error => {
                console.error('There was an error approving the request!', error);
            });
    };

    const handleCommentChange = (id, comment) => {
        setComments(prevComments => ({
            ...prevComments,
            [id]: comment
        }));
    };

    const saveComment = (id) => {
        const comment = comments[id];
        axios.post(`http://localhost:3001/api/requests/${id}/comment`, { comment })
            .then(response => {
                console.log(response.data.message);
                fetchRequests();
            })
            .catch(error => {
                console.error('There was an error saving the comment!', error);
            });
    };

    return (
        <div className="App">
            <h1>Approval Requests</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>First Name (English)</th>
                        <th>Last Name (English)</th>
                        <th>Phone Number</th>
                        <th>Referring Officer</th>
                        <th>Organization</th>
                        <th>Status</th>
                        <th>Comment</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.ID}>
                            <td>{request.ID}</td>
                            <td>{request['שעת התחלה']}</td>
                            <td>{request['שעת השלמה']}</td>
                            <td>{request['דואר אלקטרוני']}</td>
                            <td>{request['שם']}</td>
                            <td>{request['שם פרטי (באנגלית)']}</td>
                            <td>{request['שם משפחה (באנגלית)']}</td>
                            <td>{request['מספר טלפון']}</td>
                            <td>{request['גורם מפנה מענף אגמי"ם לפתיחת המשתמש (קצין מאשר מענף אגמים)']}</td>
                            <td>{request['ארגון']}</td>
                            <td>{(request.status && request.status === 'Approved') ? 'Approved' : 'Unapproved'}</td>
                            <td>
                                <input
                                    type="text"
                                    value={comments[request.ID] || ''}
                                    onChange={(e) => handleCommentChange(request.ID, e.target.value)}
                                />
                                <button onClick={() => saveComment(request.ID)}>Save Comment</button>
                            </td>
                            <td>
                                {!(request.status && request.status === 'Approved') && (
                                    <button onClick={() => approveRequest(request.ID)}>Approve</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
