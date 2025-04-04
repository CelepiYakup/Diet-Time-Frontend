'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus, FaChartLine, FaWeight, FaHeartbeat, FaTint, FaBed, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './page.module.scss';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Sidebar from '@/app/components/Sidebar';
import { useAuth } from '@/app/context/AuthContext';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import { healthApi, BodyMeasurement, VitalSign, BloodWork, SleepPattern } from '@/app/services/api';
import { toast } from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to format date strings
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Helper function to format date for input fields (YYYY-MM-DD)
const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    // Directly return the date string if it's in YYYY-MM-DD format already
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Remove any timezone info to prevent date shifts
    let datePart = dateString;
    if (dateString.includes('T')) {
      datePart = dateString.split('T')[0];
    }
    
    // If it's a simple ISO date format (YYYY-MM-DD), return it directly
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
    
    // Manual parsing without relying on Date object to avoid timezone issues
    if (datePart.includes('-')) {
      const [year, month, day] = datePart.split('-').map(Number);
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    
    // Last resort: use the Date object but be very careful with timezone
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Log to check the parsed date
    console.log('Parsing date:', dateString, 'as:', `${year}-${month}-${day}`);
    
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  } catch (e) {
    console.error('Invalid date format:', dateString);
    return '';
  }
};

// Helper function to format date for API (YYYY-MM-DD)
const formatDateForApi = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    // If it already has the right format, return it
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Parse the original parts to avoid timezone issues
    let parts: number[] = [];
    
    if (dateString.includes('T')) {
      parts = dateString.split('T')[0].split('-').map(Number);
    } else if (dateString.includes('-')) {
      parts = dateString.split('-').map(Number);
    } else {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    
    // Make sure we have year, month, day
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    
    return dateString.split('T')[0];
  } catch (e) {
    console.error('Invalid date format:', dateString);
    return '';
  }
};

// Get today's date in YYYY-MM-DD format without timezone issues
const getTodayDateString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Interface for form data
type FormData = {
  date: string;
  // Body measurements
  weight?: string;
  bmi?: string;
  bodyFat?: string;
  waist?: string;
  // Vital signs
  heartRate?: string;
  bloodPressure?: string;
  temperature?: string;
  respiratoryRate?: string;
  // Blood work
  glucose?: string;
  cholesterol?: string;
  hdl?: string;
  ldl?: string;
  triglycerides?: string;
  // Sleep patterns
  duration?: string;
  quality?: string;
  deepSleep?: string;
  remSleep?: string;
};

// Function to sort records by date (newest first)
const sortByDate = <T extends { date: string }>(records: T[]): T[] => {
  return [...records].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export default function HealthTrackingDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [bloodWork, setBloodWork] = useState<BloodWork[]>([]);
  const [sleepPatterns, setSleepPatterns] = useState<SleepPattern[]>([]);
  const [activeTab, setActiveTab] = useState('bodyMeasurements');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    date: getTodayDateString()
  });
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userId = user.id;
        
        // Use healthApi to fetch data
        try {
          const bodyMeasurementsData = await healthApi.getBodyMeasurements(userId);
          setBodyMeasurements(sortByDate(bodyMeasurementsData));
        } catch (error) {
          console.error('Error fetching body measurements:', error);
        }
        
        try {
          const vitalSignsData = await healthApi.getVitalSigns(userId);
          setVitalSigns(sortByDate(vitalSignsData));
        } catch (error) {
          console.error('Error fetching vital signs:', error);
        }
        
        try {
          const bloodWorkData = await healthApi.getBloodWork(userId);
          setBloodWork(sortByDate(bloodWorkData));
        } catch (error) {
          console.error('Error fetching blood work:', error);
        }
        
        try {
          const sleepPatternsData = await healthApi.getSleepPatterns(userId);
          setSleepPatterns(sortByDate(sleepPatternsData));
        } catch (error) {
          console.error('Error fetching sleep patterns:', error);
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Event handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddNew = () => {
    const baseFormData = { date: getTodayDateString() };
    
    switch (activeTab) {
      case 'bodyMeasurements':
        setFormData({ ...baseFormData, weight: '', bmi: '', bodyFat: '', waist: '' });
        break;
      case 'vitalSigns':
        setFormData({ ...baseFormData, heartRate: '', bloodPressure: '', temperature: '', respiratoryRate: '' });
        break;
      case 'bloodWork':
        setFormData({ ...baseFormData, glucose: '', cholesterol: '', hdl: '', ldl: '', triglycerides: '' });
        break;
      case 'sleepPatterns':
        setFormData({ ...baseFormData, duration: '', quality: '', deepSleep: '', remSleep: '' });
        break;
    }
    
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditEntry = (type: string, entry: BodyMeasurement | VitalSign | BloodWork | SleepPattern) => {
    setActiveTab(type);
    
    // Convert date to browser-compatible format (YYYY-MM-DD)
    const rawDate = entry.date;
    let formattedDate = '';
    
    // First try to split by T if present
    if (rawDate.includes('T')) {
      formattedDate = rawDate.split('T')[0];
    } else if (rawDate.includes('-') && rawDate.split('-').length === 3) {
      // Already in YYYY-MM-DD format
      formattedDate = rawDate;
    } else {
      // Fallback to a safer method
      try {
        const dateObj = new Date(rawDate);
        formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      } catch (e) {
        console.error('Could not parse date:', rawDate);
        formattedDate = getTodayDateString(); // Default to today as a fallback
      }
    }
    
    console.log('Setting edit date to:', formattedDate, 'Original date:', rawDate);
    
    switch (type) {
      case 'bodyMeasurements': {
        const bodyEntry = entry as BodyMeasurement;
        setFormData({
          date: formattedDate,
          weight: bodyEntry.weight,
          bmi: bodyEntry.bmi,
          bodyFat: bodyEntry.body_fat,
          waist: bodyEntry.waist
        });
        break;
      }
      case 'vitalSigns': {
        const vitalEntry = entry as VitalSign;
        setFormData({
          date: formattedDate,
          heartRate: vitalEntry.heart_rate,
          bloodPressure: vitalEntry.blood_pressure,
          temperature: vitalEntry.temperature,
          respiratoryRate: vitalEntry.respiratory_rate
        });
        break;
      }
      case 'bloodWork': {
        const bloodEntry = entry as BloodWork;
        setFormData({
          date: formattedDate,
          glucose: bloodEntry.glucose,
          cholesterol: bloodEntry.cholesterol,
          hdl: bloodEntry.hdl,
          ldl: bloodEntry.ldl,
          triglycerides: bloodEntry.triglycerides
        });
        break;
      }
      case 'sleepPatterns': {
        const sleepEntry = entry as SleepPattern;
        setFormData({
          date: formattedDate,
          duration: sleepEntry.duration,
          quality: sleepEntry.quality,
          deepSleep: sleepEntry.deep_sleep,
          remSleep: sleepEntry.rem_sleep
        });
        break;
      }
    }
    
    setEditingEntryId(entry.id);
    setShowForm(true);
  };

  const handleDeleteEntry = async (type: string, id: string) => {
    if (!user) return;
    
    try {
      switch (type) {
        case 'bodyMeasurements':
          await healthApi.deleteBodyMeasurement(id);
          setBodyMeasurements(prev => sortByDate(prev.filter(item => item.id !== id)));
          break;
        case 'vitalSigns':
          await healthApi.deleteVitalSign(id);
          setVitalSigns(prev => sortByDate(prev.filter(item => item.id !== id)));
          break;
        case 'bloodWork':
          await healthApi.deleteBloodWork(id);
          setBloodWork(prev => sortByDate(prev.filter(item => item.id !== id)));
          break;
        case 'sleepPatterns':
          await healthApi.deleteSleepPattern(id);
          setSleepPatterns(prev => sortByDate(prev.filter(item => item.id !== id)));
          break;
      }
      
      toast.success('Record successfully deleted.');
    } catch (error) {
      console.error('Error during delete operation:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const userId = user.id;
      
      // Prepare data and submit based on active tab
      switch (activeTab) {
        case 'bodyMeasurements': {
          const data = {
            user_id: userId,
            date: formatDateForApi(formData.date),
            weight: formData.weight || '',
            bmi: formData.bmi || '',
            body_fat: formData.bodyFat || '',
            waist: formData.waist || ''
          };
          
          if (editingEntryId) {
            const updatedRecord = await healthApi.updateBodyMeasurement(editingEntryId, data);
            // Update local state to reflect changes immediately
            setBodyMeasurements(prevMeasurements => 
              sortByDate(prevMeasurements.map(item => 
                item.id === editingEntryId ? updatedRecord : item
              ))
            );
            toast.success('Body measurement record updated successfully.');
          } else {
            const newRecord = await healthApi.createBodyMeasurement(data);
            setBodyMeasurements(prev => sortByDate([...prev, newRecord]));
            toast.success('New body measurement record created.');
          }
          break;
        }
        case 'vitalSigns': {
          const data = {
            user_id: userId,
            date: formatDateForApi(formData.date),
            heart_rate: formData.heartRate || '',
            blood_pressure: formData.bloodPressure || '',
            temperature: formData.temperature || '',
            respiratory_rate: formData.respiratoryRate || ''
          };
          
          if (editingEntryId) {
            const updatedRecord = await healthApi.updateVitalSign(editingEntryId, data);
            // Update local state to reflect changes immediately
            setVitalSigns(prevSigns => 
              sortByDate(prevSigns.map(item => 
                item.id === editingEntryId ? updatedRecord : item
              ))
            );
            toast.success('Vital signs record updated successfully.');
          } else {
            const newRecord = await healthApi.createVitalSign(data);
            setVitalSigns(prev => sortByDate([...prev, newRecord]));
            toast.success('New vital signs record created.');
          }
          break;
        }
        case 'bloodWork': {
          const data = {
            user_id: userId,
            date: formatDateForApi(formData.date),
            glucose: formData.glucose || '',
            cholesterol: formData.cholesterol || '',
            hdl: formData.hdl || '',
            ldl: formData.ldl || '',
            triglycerides: formData.triglycerides || ''
          };
          
          if (editingEntryId) {
            const updatedRecord = await healthApi.updateBloodWork(editingEntryId, data);
            // Update local state to reflect changes immediately
            setBloodWork(prevWork => 
              sortByDate(prevWork.map(item => 
                item.id === editingEntryId ? updatedRecord : item
              ))
            );
            toast.success('Blood work record updated successfully.');
          } else {
            const newRecord = await healthApi.createBloodWork(data);
            setBloodWork(prev => sortByDate([...prev, newRecord]));
            toast.success('New blood work record created.');
          }
          break;
        }
        case 'sleepPatterns': {
          const data = {
            user_id: userId,
            date: formatDateForApi(formData.date),
            duration: formData.duration || '',
            quality: formData.quality || '',
            deep_sleep: formData.deepSleep || '',
            rem_sleep: formData.remSleep || ''
          };
          
          if (editingEntryId) {
            const updatedRecord = await healthApi.updateSleepPattern(editingEntryId, data);
            // Update local state to reflect changes immediately
            setSleepPatterns(prevPatterns => 
              sortByDate(prevPatterns.map(item => 
                item.id === editingEntryId ? updatedRecord : item
              ))
            );
            toast.success('Sleep pattern record updated successfully.');
          } else {
            const newRecord = await healthApi.createSleepPattern(data);
            setSleepPatterns(prev => sortByDate([...prev, newRecord]));
            toast.success('New sleep pattern record created.');
          }
          break;
        }
      }
      
      // Reset form
      setFormData({ date: getTodayDateString() });
      setEditingEntryId(null);
      setShowForm(false);
      
    } catch (error) {
      console.error('Error submitting health data:', error);
      toast.error('Error saving data. Please try again.');
    }
  };

  const renderBodyMeasurements = () => {
    // Weight trend chart data
    const chartData = {
      labels: bodyMeasurements.map(entry => formatDate(entry.date)).reverse(),
      datasets: [
        {
          label: 'Weight (lbs)',
          data: bodyMeasurements.map(entry => parseFloat(entry.weight || '0')).reverse(),
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Weight Trend Over Time'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Weight (lbs)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    };

    return (
      <div>
        <div className={styles.metricsHeader}>
          <h3 className={styles.metricsTitle}>Body Measurements History</h3>
          <button className={styles.addButton} onClick={handleAddNew}>
            <FaPlus /> Add New
          </button>
        </div>
        
        <div className={styles.metricsTable}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (lbs)</th>
                <th>BMI</th>
                <th>Body Fat %</th>
                <th>Waist (in)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bodyMeasurements.map(entry => (
                <tr key={entry.id}>
                  <td>{formatDate(entry.date)}</td>
                  <td>{entry.weight}</td>
                  <td>{entry.bmi}</td>
                  <td>{entry.body_fat ? `${entry.body_fat}%` : '-'}</td>
                  <td>{entry.waist}</td>
                  <td className={styles.actionButtons}>
                    <button 
                      className={styles.editButton} 
                      onClick={() => handleEditEntry('bodyMeasurements', entry)}
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className={styles.deleteButton} 
                      onClick={() => handleDeleteEntry('bodyMeasurements', entry.id)}
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {bodyMeasurements.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.noData}>No measurements recorded yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className={styles.chartContainer}>
          <h4 className={styles.chartTitle}>Weight Trend</h4>
          {bodyMeasurements.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className={styles.chartPlaceholder}>
              <FaChartLine className={styles.chartIcon} />
              <p>Add weight measurements to see trend chart</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVitalSigns = () => {
    // Heart rate trend chart data
    const chartData = {
      labels: vitalSigns.map(entry => formatDate(entry.date)).reverse(),
      datasets: [
        {
          label: 'Heart Rate (bpm)',
          data: vitalSigns.map(entry => parseFloat(entry.heart_rate || '0')).reverse(),
          fill: false,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.1
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Heart Rate Trend Over Time'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Heart Rate (bpm)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    };

    return (
      <div>
        <div className={styles.metricsHeader}>
          <h3 className={styles.metricsTitle}>Vital Signs History</h3>
          <button className={styles.addButton} onClick={handleAddNew}>
            <FaPlus /> Add New
          </button>
        </div>
        
        <div className={styles.metricsTable}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Heart Rate (bpm)</th>
                <th>Blood Pressure</th>
                <th>Temperature (°F)</th>
                <th>Respiratory Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vitalSigns.map(entry => (
                <tr key={entry.id}>
                  <td>{formatDate(entry.date)}</td>
                  <td>{entry.heart_rate}</td>
                  <td>{entry.blood_pressure}</td>
                  <td>{entry.temperature}</td>
                  <td>{entry.respiratory_rate}</td>
                  <td className={styles.actionButtons}>
                    <button 
                      className={styles.editButton} 
                      onClick={() => handleEditEntry('vitalSigns', entry)}
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className={styles.deleteButton} 
                      onClick={() => handleDeleteEntry('vitalSigns', entry.id)}
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {vitalSigns.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.noData}>No vital signs recorded yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className={styles.chartContainer}>
          <h4 className={styles.chartTitle}>Heart Rate Trend</h4>
          {vitalSigns.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className={styles.chartPlaceholder}>
              <FaChartLine className={styles.chartIcon} />
              <p>Add vital sign measurements to see heart rate trend</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBloodWork = () => {
    // Cholesterol levels chart data
    const cholesterolChartData = {
      labels: bloodWork.map(entry => formatDate(entry.date)).reverse(),
      datasets: [
        {
          label: 'Total Cholesterol',
          data: bloodWork.map(entry => parseFloat(entry.cholesterol || '0')).reverse(),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.1
        },
        {
          label: 'HDL',
          data: bloodWork.map(entry => parseFloat(entry.hdl || '0')).reverse(),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        },
        {
          label: 'LDL',
          data: bloodWork.map(entry => parseFloat(entry.ldl || '0')).reverse(),
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          tension: 0.1
        },
        {
          label: 'Triglycerides',
          data: bloodWork.map(entry => parseFloat(entry.triglycerides || '0')).reverse(),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          tension: 0.1
        }
      ]
    };

    // Glucose trend chart data
    const glucoseChartData = {
      labels: bloodWork.map(entry => formatDate(entry.date)).reverse(),
      datasets: [
        {
          label: 'Glucose (mg/dL)',
          data: bloodWork.map(entry => parseFloat(entry.glucose || '0')).reverse(),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.1,
          fill: false
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Cholesterol Levels Over Time'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Level (mg/dL)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    };

    const glucoseChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Glucose Levels Over Time'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Glucose (mg/dL)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    };

    return (
      <div>
        <div className={styles.metricsHeader}>
          <h3 className={styles.metricsTitle}>Blood Work History</h3>
          <button className={styles.addButton} onClick={handleAddNew}>
            <FaPlus /> Add New
          </button>
        </div>
        
        <div className={styles.metricsTable}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Glucose (mg/dL)</th>
                <th>Total Cholesterol</th>
                <th>HDL</th>
                <th>LDL</th>
                <th>Triglycerides</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bloodWork.map(entry => (
                <tr key={entry.id}>
                  <td>{formatDate(entry.date)}</td>
                  <td>{entry.glucose}</td>
                  <td>{entry.cholesterol}</td>
                  <td>{entry.hdl}</td>
                  <td>{entry.ldl}</td>
                  <td>{entry.triglycerides}</td>
                  <td className={styles.actionButtons}>
                    <button 
                      className={styles.editButton} 
                      onClick={() => handleEditEntry('bloodWork', entry)}
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className={styles.deleteButton} 
                      onClick={() => handleDeleteEntry('bloodWork', entry.id)}
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {bloodWork.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.noData}>No blood work records yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className={styles.chartsRow}>
          <div className={styles.chartContainer}>
            <h4 className={styles.chartTitle}>Cholesterol Levels</h4>
            {bloodWork.length > 0 ? (
              <Line data={cholesterolChartData} options={chartOptions} />
            ) : (
              <div className={styles.chartPlaceholder}>
                <FaChartLine className={styles.chartIcon} />
                <p>Add blood work measurements to see cholesterol trends</p>
              </div>
            )}
          </div>
          <div className={styles.chartContainer}>
            <h4 className={styles.chartTitle}>Glucose Trend</h4>
            {bloodWork.length > 0 ? (
              <Line data={glucoseChartData} options={glucoseChartOptions} />
            ) : (
              <div className={styles.chartPlaceholder}>
                <FaChartLine className={styles.chartIcon} />
                <p>Add blood work measurements to see glucose trends</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSleepPatterns = () => {
    // Sleep duration trend chart data
    const chartData = {
      labels: sleepPatterns.map(entry => formatDate(entry.date)).reverse(),
      datasets: [
        {
          label: 'Total Sleep (hrs)',
          data: sleepPatterns.map(entry => parseFloat(entry.duration || '0')).reverse(),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          tension: 0.1
        },
        {
          label: 'Deep Sleep (hrs)',
          data: sleepPatterns.map(entry => entry.deep_sleep ? parseFloat(entry.deep_sleep) : null).reverse(),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.1
        },
        {
          label: 'REM Sleep (hrs)',
          data: sleepPatterns.map(entry => entry.rem_sleep ? parseFloat(entry.rem_sleep) : null).reverse(),
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          tension: 0.1
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Sleep Duration Trend Over Time'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Duration (hrs)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    };

    return (
      <div>
        <div className={styles.metricsHeader}>
          <h3 className={styles.metricsTitle}>Sleep Patterns History</h3>
          <button className={styles.addButton} onClick={handleAddNew}>
            <FaPlus /> Add New
          </button>
        </div>
        
        <div className={styles.metricsTable}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Duration (hrs)</th>
                <th>Quality</th>
                <th>Deep Sleep (hrs)</th>
                <th>REM Sleep (hrs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sleepPatterns.map(entry => (
                <tr key={entry.id}>
                  <td>{formatDate(entry.date)}</td>
                  <td>{entry.duration}</td>
                  <td>{entry.quality}</td>
                  <td>{entry.deep_sleep || '-'}</td>
                  <td>{entry.rem_sleep || '-'}</td>
                  <td className={styles.actionButtons}>
                    <button 
                      className={styles.editButton} 
                      onClick={() => handleEditEntry('sleepPatterns', entry)}
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className={styles.deleteButton} 
                      onClick={() => handleDeleteEntry('sleepPatterns', entry.id)}
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {sleepPatterns.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.noData}>No sleep pattern records yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className={styles.chartContainer}>
          <h4 className={styles.chartTitle}>Sleep Duration Trend</h4>
          {sleepPatterns.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className={styles.chartPlaceholder}>
              <FaChartLine className={styles.chartIcon} />
              <p>Add sleep measurements to see duration trends</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderForm = () => {
    let formFields;
    
    switch (activeTab) {
      case 'bodyMeasurements':
        formFields = (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" value={formData.date || ''} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="weight">Weight (lbs)</label>
              <input type="number" id="weight" name="weight" value={formData.weight || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="bmi">BMI</label>
              <input type="number" id="bmi" name="bmi" step="0.1" value={formData.bmi || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="bodyFat">Body Fat %</label>
              <input type="number" id="bodyFat" name="bodyFat" step="0.1" value={formData.bodyFat || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="waist">Waist (in)</label>
              <input type="number" id="waist" name="waist" step="0.1" value={formData.waist || ''} onChange={handleInputChange} />
            </div>
          </>
        );
        break;
        
      case 'vitalSigns':
        formFields = (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" value={formData.date || ''} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="heartRate">Heart Rate (bpm)</label>
              <input type="number" id="heartRate" name="heartRate" value={formData.heartRate || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="bloodPressure">Blood Pressure</label>
              <input type="text" id="bloodPressure" name="bloodPressure" placeholder="e.g. 120/80" value={formData.bloodPressure || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="temperature">Temperature (°F)</label>
              <input type="number" id="temperature" name="temperature" step="0.1" value={formData.temperature || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="respiratoryRate">Respiratory Rate</label>
              <input type="number" id="respiratoryRate" name="respiratoryRate" value={formData.respiratoryRate || ''} onChange={handleInputChange} />
            </div>
          </>
        );
        break;
        
      case 'bloodWork':
        formFields = (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" value={formData.date || ''} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="glucose">Glucose (mg/dL)</label>
              <input type="number" id="glucose" name="glucose" value={formData.glucose || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cholesterol">Total Cholesterol</label>
              <input type="number" id="cholesterol" name="cholesterol" value={formData.cholesterol || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="hdl">HDL</label>
              <input type="number" id="hdl" name="hdl" value={formData.hdl || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="ldl">LDL</label>
              <input type="number" id="ldl" name="ldl" value={formData.ldl || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="triglycerides">Triglycerides</label>
              <input type="number" id="triglycerides" name="triglycerides" value={formData.triglycerides || ''} onChange={handleInputChange} />
            </div>
          </>
        );
        break;
        
      case 'sleepPatterns':
        formFields = (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" value={formData.date || ''} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="duration">Duration (hrs)</label>
              <input type="number" id="duration" name="duration" step="0.1" value={formData.duration || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="quality">Quality</label>
              <select id="quality" name="quality" value={formData.quality || ''} onChange={handleInputChange}>
                <option value="">Select quality</option>
                <option value="Poor">Poor</option>
                <option value="Fair">Fair</option>
                <option value="Good">Good</option>
                <option value="Excellent">Excellent</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="deepSleep">Deep Sleep (hrs)</label>
              <input type="number" id="deepSleep" name="deepSleep" step="0.1" value={formData.deepSleep || ''} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="remSleep">REM Sleep (hrs)</label>
              <input type="number" id="remSleep" name="remSleep" step="0.1" value={formData.remSleep || ''} onChange={handleInputChange} />
            </div>
          </>
        );
        break;
    }
    
    return (
      <div className={`${styles.formOverlay} ${showForm ? styles.active : ''}`}>
        <div className={styles.formContainer}>
          <h3 className={styles.formTitle}>
            {editingEntryId ? 'Edit Health Data' : 'Add New Health Data'}
          </h3>
          <form onSubmit={handleSubmit}>
            {formFields}
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton} onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                Save Data
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      {isSidebarOpen && (
        <Sidebar 
          isOpen={true}
          isCollapsed={false}
          onClose={toggleSidebar} 
        />
      )}
      
      <div className={styles.healthTrackingContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Health Tracking Dashboard</h1>
          <p className={styles.dashboardDescription}>
            Monitor your health metrics and track your progress over time.
          </p>
        </div>
        
        {!isAuthenticated ? (
          <div className={styles.authMessage}>
            <h2>Please log in to view your health data</h2>
            <p>You need to be logged in to access your personal health tracking dashboard.</p>
          </div>
        ) : loading ? (
          <LoadingIndicator text="Loading your health data..." />
        ) : (
          <>
            <div className={styles.dashboardOverview}>
              <div className={styles.overviewCard}>
                <div className={styles.overviewIcon}>
                  <FaWeight />
                </div>
                <div className={styles.overviewData}>
                  <span className={styles.overviewLabel}>Current Weight</span>
                  <span className={styles.overviewValue}>
                    {bodyMeasurements.length > 0 ? bodyMeasurements[bodyMeasurements.length - 1].weight : 'N/A'} lbs
                  </span>
                </div>
              </div>
              
              <div className={styles.overviewCard}>
                <div className={styles.overviewIcon}>
                  <FaHeartbeat />
                </div>
                <div className={styles.overviewData}>
                  <span className={styles.overviewLabel}>Heart Rate</span>
                  <span className={styles.overviewValue}>
                    {vitalSigns.length > 0 ? vitalSigns[0].heart_rate : 'N/A'} bpm
                  </span>
                </div>
              </div>
              
              <div className={styles.overviewCard}>
                <div className={styles.overviewIcon}>
                  <FaTint />
                </div>
                <div className={styles.overviewData}>
                  <span className={styles.overviewLabel}>Blood Pressure</span>
                  <span className={styles.overviewValue}>
                    {vitalSigns.length > 0 ? vitalSigns[0].blood_pressure : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className={styles.overviewCard}>
                <div className={styles.overviewIcon}>
                  <FaBed />
                </div>
                <div className={styles.overviewData}>
                  <span className={styles.overviewLabel}>Sleep Duration</span>
                  <span className={styles.overviewValue}>
                    {sleepPatterns.length > 0 ? sleepPatterns[0].duration : 'N/A'} hrs
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.tabsContainer}>
              <div className={styles.tabs}>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'bodyMeasurements' ? styles.active : ''}`}
                  onClick={() => handleTabChange('bodyMeasurements')}
                >
                  <FaWeight className={styles.tabIcon} /> Body Measurements
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'vitalSigns' ? styles.active : ''}`}
                  onClick={() => handleTabChange('vitalSigns')}
                >
                  <FaHeartbeat className={styles.tabIcon} /> Vital Signs
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'bloodWork' ? styles.active : ''}`}
                  onClick={() => handleTabChange('bloodWork')}
                >
                  <FaTint className={styles.tabIcon} /> Blood Work
                </button>
                <button 
                  className={`${styles.tabButton} ${activeTab === 'sleepPatterns' ? styles.active : ''}`}
                  onClick={() => handleTabChange('sleepPatterns')}
                >
                  <FaBed className={styles.tabIcon} /> Sleep Patterns
                </button>
              </div>
              
              <div className={styles.tabContent}>
                {activeTab === 'bodyMeasurements' && renderBodyMeasurements()}
                {activeTab === 'vitalSigns' && renderVitalSigns()}
                {activeTab === 'bloodWork' && renderBloodWork()}
                {activeTab === 'sleepPatterns' && renderSleepPatterns()}
              </div>
            </div>
            
            {renderForm()}
          </>
        )}
      </div>
    </div>
  );
}
