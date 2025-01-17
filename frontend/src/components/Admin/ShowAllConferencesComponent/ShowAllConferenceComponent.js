import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './styles'; // Import your styles
import { format } from 'date-fns';

const ShowAllConferenceComponent = () => {
    const [conferences, setConferences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(''); // For date filter
    const [searchQuery, setSearchQuery] = useState(''); // For name filter

    const [filters, setFilters] = useState({ date: '', name: '' }); // Store applied filters

    const navigate = useNavigate();

    // Fetch conferences from the backend
    const fetchConferences = async () => {
        const token = sessionStorage.getItem('authToken');
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://localhost:8080/api/get-admin-events', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    date: filters.date || undefined, // Include only if date is set
                    name: filters.name || undefined, // Include only if name is set
                },
            });

            setConferences(response.data.data || []);
        } catch (error) {
            console.error('Error fetching conferences:', error.response?.data || error.message);
            setError('Pri načítaní konferencií nastala chyba.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch conferences on component mount and when filters are applied
    useEffect(() => {
        fetchConferences();
    }, [filters]);

    // Handle date change
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value); // Update local state only
    };

    // Handle name change
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value); // Update local state only
    };

    // Apply filters
    const handleApplyFilters = () => {
        setFilters({ date: selectedDate, name: searchQuery }); // Update applied filters
    };

    // Handle reload button click
    const handleReload = () => {
        setFilters({ date: '', name: '' }); // Reset filters and fetch all conferences
        setSelectedDate('');
        setSearchQuery('');
    };

    if (isLoading) {
        return (
            <div style={styles.loaderContainer}>
                <div style={styles.loader}></div>
            </div>
        );
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Zoznam konferencií</h2>

            {/* Filters */}
            <div style={styles.filters}>
                {/* Date Picker */}
                <input
                    type="date"
                    onChange={handleDateChange}
                    value={selectedDate}
                    style={styles.input}
                />

                {/* Name Filter */}
                <input
                    type="text"
                    placeholder="Filtrovať podľa názvu"
                    onChange={handleSearchQueryChange}
                    value={searchQuery}
                    style={styles.input}
                />

                {/* Apply Filters Button */}
                <button onClick={handleApplyFilters} style={styles.button}>
                    Použiť filtre
                </button>

                {/* Reload Button */}
                <button onClick={handleReload} style={styles.button}>
                    Načítať znovu
                </button>
            </div>

            {/* Conference List */}
            {conferences.length === 0 ? (
                <p style={styles.noData}>Žiadne konferencie na zobrazenie.</p>
            ) : (
                <div style={styles.conferenceList}>
                    {conferences.map((conference) => (
                        <div
                            key={conference.idevent} // Ensure key is unique
                            style={styles.conferenceItem}
                            onClick={() => navigate(`/conferences/${conference.idevent}`)}
                        >
                            <h3>{conference.event_name}</h3>
                            <p>Dátum konferencie: {format(new Date(conference.event_date), 'dd.MM.yyyy')}</p>
                            <p>
                                Dátum ukončenia nahrávania:{' '}
                                {format(new Date(conference.event_upload_EndDate), 'dd.MM.yyyy')}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowAllConferenceComponent;
