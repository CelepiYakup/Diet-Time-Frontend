'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus, FaChartLine, FaWeight, FaHeartbeat, FaTint, FaBed } from 'react-icons/fa';
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
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';

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

type BodyMeasurement = { id: string; date: string; weight: string; bmi: string; bodyFat: string; waist: string; };
type VitalSign = { id: string; date: string; heartRate: string; bloodPressure: string; temperature: string; respiratoryRate: string; };
type BloodWork = { id: string; date: string; glucose: string; cholesterol: string; hdl: string; ldl: string; triglycerides: string; };
type SleepPattern = { id: string; date: string; duration: string; quality: string; deepSleep: string; remSleep: string; };

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

export default function HealthTrackingDashboard() {
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [bloodWork, setBloodWork] = useState<BloodWork[]>([]);
  const [sleepPatterns, setSleepPatterns] = useState<SleepPattern[]>([]);
  const [activeTab, setActiveTab] = useState('bodyMeasurements');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0]
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sidebar toggle fonksiyonu
  const toggleSidebar = () => {
    console.log('Sidebar toggle çağrıldı, mevcut durum:', isSidebarOpen);
    
    // DOM'da sidebar elementini kontrol et
    const sidebarElement = document.querySelector('[class*="Sidebar_sidebar"]');
    console.log('Sidebar element:', sidebarElement);
    
    // Sidebar class'larını kontrol et
    if (sidebarElement) {
      console.log('Sidebar class list:', sidebarElement.className);
    }
    
    // State'i güncelle
    setIsSidebarOpen(prevState => {
      console.log('Sidebar state güncelleniyor:', prevState, ' -> ', !prevState);
      return !prevState;
    });
  };

  // Sidebar durumunu izleyelim
  useEffect(() => {
    console.log('Sidebar durumu değişti:', isSidebarOpen);
    
    // Sidebar açıksa, DOM'da sidebar elementini kontrol et
    if (isSidebarOpen) {
      setTimeout(() => {
        const sidebarElement = document.querySelector('[class*="Sidebar_sidebar"]');
        console.log('Sidebar element (after state change):', sidebarElement);
        
        if (sidebarElement) {
          console.log('Sidebar class list (after state change):', sidebarElement.className);
        }
      }, 100);
    }
  }, [isSidebarOpen]);

  // GET isteklerini fetch ile gerçekleştiriyoruz.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 1; // Örnek kullanıcı ID'si
        const [bodyRes, vitalRes, bloodRes, sleepRes] = await Promise.all([
          fetch(`/api/health/body-measurements/user/${userId}`),
          fetch(`/api/health/vital-signs/user/${userId}`),
          fetch(`/api/health/blood-work/user/${userId}`),
          fetch(`/api/health/sleep-patterns/user/${userId}`)
        ]);

        // Check each response individually and log specific errors
        const responseChecks = [
          { name: 'Body Measurements', res: bodyRes },
          { name: 'Vital Signs', res: vitalRes },
          { name: 'Blood Work', res: bloodRes },
          { name: 'Sleep Patterns', res: sleepRes }
        ];
        
        const failedResponses = responseChecks.filter(check => !check.res.ok);
        
        if (failedResponses.length > 0) {
          const failedEndpoints = failedResponses.map(check => 
            `${check.name} (Status: ${check.res.status} ${check.res.statusText})`
          ).join(', ');
          console.error(`Failed API endpoints: ${failedEndpoints}`);
          throw new Error(`API requests failed: ${failedEndpoints}`);
        }

        const bodyData = await bodyRes.json();
        const vitalData = await vitalRes.json();
        const bloodData = await bloodRes.json();
        const sleepData = await sleepRes.json();

        setBodyMeasurements(bodyData);
        setVitalSigns(vitalData);
        setBloodWork(bloodData);
        setSleepPatterns(sleepData);
      } catch (error) {
        console.error('Error fetching health data:', error);
        // Initialize with empty arrays to prevent rendering errors
        setBodyMeasurements([]);
        setVitalSigns([]);
        setBloodWork([]);
        setSleepPatterns([]);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddNew = () => {
    const baseFormData = { date: new Date().toISOString().split('T')[0] };
    if (activeTab === 'bodyMeasurements') {
      setFormData({ ...baseFormData, weight: '', bmi: '', bodyFat: '', waist: '' });
    } else if (activeTab === 'vitalSigns') {
      setFormData({ ...baseFormData, heartRate: '', bloodPressure: '', temperature: '', respiratoryRate: '' });
    } else if (activeTab === 'bloodWork') {
      setFormData({ ...baseFormData, glucose: '', cholesterol: '', hdl: '', ldl: '', triglycerides: '' });
    } else if (activeTab === 'sleepPatterns') {
      setFormData({ ...baseFormData, duration: '', quality: '', deepSleep: '', remSleep: '' });
    }
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // POST isteklerini fetch ile gerçekleştiriyoruz.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userId = 1; // Örnek kullanıcı ID'si
      let url = '';
      let dataToSend = {};
      
      if (activeTab === 'bodyMeasurements') {
        url = '/api/health/body-measurements';
        dataToSend = {
          user_id: userId,
          date: formData.date,
          weight: formData.weight,
          bmi: formData.bmi,
          bodyFat: formData.bodyFat,
          waist: formData.waist
        };
      } else if (activeTab === 'vitalSigns') {
        url = '/api/health/vital-signs';
        dataToSend = {
          user_id: userId,
          date: formData.date,
          heart_rate: formData.heartRate,
          blood_pressure: formData.bloodPressure,
          temperature: formData.temperature,
          respiratory_rate: formData.respiratoryRate
        };
      } else if (activeTab === 'bloodWork') {
        url = '/api/health/blood-work';
        dataToSend = {
          user_id: userId,
          date: formData.date,
          glucose: formData.glucose,
          cholesterol: formData.cholesterol,
          hdl: formData.hdl,
          ldl: formData.ldl,
          triglycerides: formData.triglycerides
        };
      } else if (activeTab === 'sleepPatterns') {
        url = '/api/health/sleep-patterns';
        dataToSend = {
          user_id: userId,
          date: formData.date,
          duration: formData.duration,
          quality: formData.quality,
          deep_sleep: formData.deepSleep,
          rem_sleep: formData.remSleep
        };
      }
      
      console.log('Sending data to:', url);
      console.log('Data being sent:', dataToSend);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Error submitting health data: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Submission successful:', result);
      
      // Refresh data after successful submission
      const fetchData = async () => {
        try {
          const [bodyRes, vitalRes, bloodRes, sleepRes] = await Promise.all([
            fetch(`/api/health/body-measurements/user/${userId}`),
            fetch(`/api/health/vital-signs/user/${userId}`),
            fetch(`/api/health/blood-work/user/${userId}`),
            fetch(`/api/health/sleep-patterns/user/${userId}`)
          ]);
          
          if (bodyRes.ok) setBodyMeasurements(await bodyRes.json());
          if (vitalRes.ok) setVitalSigns(await vitalRes.json());
          if (bloodRes.ok) setBloodWork(await bloodRes.json());
          if (sleepRes.ok) setSleepPatterns(await sleepRes.json());
        } catch (error) {
          console.error('Error refreshing data after submission:', error);
        }
      };
      
      fetchData();
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0]
      });
      
    } catch (error) {
      console.error('Error submitting health data:', error);
      alert('Veri gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setShowForm(false);
    }
  };

  const renderBodyMeasurements = () => {
    // Prepare data for weight trend chart
    const chartData = {
      labels: bodyMeasurements.map(entry => entry.date).reverse(),
      datasets: [
        {
          label: 'Weight (lbs)',
          data: bodyMeasurements.map(entry => parseFloat(entry.weight)).reverse(),
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
              </tr>
            </thead>
            <tbody>
              {bodyMeasurements.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.weight}</td>
                  <td>{entry.bmi}</td>
                  <td>{entry.bodyFat}%</td>
                  <td>{entry.waist}</td>
                </tr>
              ))}
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
    // Prepare data for heart rate trend chart
    const chartData = {
      labels: vitalSigns.map(entry => entry.date).reverse(),
      datasets: [
        {
          label: 'Heart Rate (bpm)',
          data: vitalSigns.map(entry => parseFloat(entry.heartRate)).reverse(),
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
              </tr>
            </thead>
            <tbody>
              {vitalSigns.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.heartRate}</td>
                  <td>{entry.bloodPressure}</td>
                  <td>{entry.temperature}</td>
                  <td>{entry.respiratoryRate}</td>
                </tr>
              ))}
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
    // Prepare data for cholesterol levels chart
    const cholesterolChartData = {
      labels: bloodWork.map(entry => entry.date).reverse(),
      datasets: [
        {
          label: 'Total Cholesterol',
          data: bloodWork.map(entry => parseFloat(entry.cholesterol)).reverse(),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.1
        },
        {
          label: 'HDL',
          data: bloodWork.map(entry => parseFloat(entry.hdl)).reverse(),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        },
        {
          label: 'LDL',
          data: bloodWork.map(entry => parseFloat(entry.ldl)).reverse(),
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          tension: 0.1
        },
        {
          label: 'Triglycerides',
          data: bloodWork.map(entry => parseFloat(entry.triglycerides)).reverse(),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          tension: 0.1
        }
      ]
    };

    // Prepare data for glucose trend chart
    const glucoseChartData = {
      labels: bloodWork.map(entry => entry.date).reverse(),
      datasets: [
        {
          label: 'Glucose (mg/dL)',
          data: bloodWork.map(entry => parseFloat(entry.glucose)).reverse(),
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
              </tr>
            </thead>
            <tbody>
              {bloodWork.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.glucose}</td>
                  <td>{entry.cholesterol}</td>
                  <td>{entry.hdl}</td>
                  <td>{entry.ldl}</td>
                  <td>{entry.triglycerides}</td>
                </tr>
              ))}
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
    // Prepare data for sleep duration trend chart
    const chartData = {
      labels: sleepPatterns.map(entry => entry.date).reverse(),
      datasets: [
        {
          label: 'Total Sleep (hrs)',
          data: sleepPatterns.map(entry => parseFloat(entry.duration)).reverse(),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          tension: 0.1
        },
        {
          label: 'Deep Sleep (hrs)',
          data: sleepPatterns.map(entry => parseFloat(entry.deepSleep)).reverse(),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.1
        },
        {
          label: 'REM Sleep (hrs)',
          data: sleepPatterns.map(entry => parseFloat(entry.remSleep)).reverse(),
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
              </tr>
            </thead>
            <tbody>
              {sleepPatterns.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.duration}</td>
                  <td>{entry.quality}</td>
                  <td>{entry.deepSleep}</td>
                  <td>{entry.remSleep}</td>
                </tr>
              ))}
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
    if (activeTab === 'bodyMeasurements') {
      formFields = (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={formData.date || ''} onChange={handleInputChange} />
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
    } else if (activeTab === 'vitalSigns') {
      formFields = (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={formData.date || ''} onChange={handleInputChange} />
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
    } else if (activeTab === 'bloodWork') {
      formFields = (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={formData.date || ''} onChange={handleInputChange} />
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
    } else if (activeTab === 'sleepPatterns') {
      formFields = (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={formData.date || ''} onChange={handleInputChange} />
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
    }
    
    return (
      <div className={`${styles.formOverlay} ${showForm ? styles.active : ''}`}>
        <div className={styles.formContainer}>
          <h3 className={styles.formTitle}>Add New Health Data</h3>
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
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className={styles.healthTrackingContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Health Tracking Dashboard</h1>
          <p className={styles.dashboardDescription}>
            Monitor your health metrics and track your progress over time.
          </p>
          
          {/* Test butonu */}
          <button 
            onClick={toggleSidebar} 
            style={{ 
              padding: '10px 20px', 
              background: '#4a90e2', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Test Sidebar Toggle
          </button>
        </div>
        
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
                {vitalSigns.length > 0 ? vitalSigns[vitalSigns.length - 1].heartRate : 'N/A'} bpm
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
                {vitalSigns.length > 0 ? vitalSigns[vitalSigns.length - 1].bloodPressure : 'N/A'}
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
                {sleepPatterns.length > 0 ? sleepPatterns[sleepPatterns.length - 1].duration : 'N/A'} hrs
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
      </div>
    </div>
  );
}
