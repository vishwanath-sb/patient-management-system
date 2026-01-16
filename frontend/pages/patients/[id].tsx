import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api, getToken } from '@/utils/api';

interface Patient {
  id: number;
  name: string;
  city: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  diagnosis?: string;
  prescription?: string;
  bmi: number;
  verdict: string;
  created_at: string;
}

export default function PatientDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    if (id) {
      fetchPatient(parseInt(id as string));
    }
  }, [id, router]);

  const fetchPatient = async (patientId: number) => {
    try {
      const data = await api.getPatient(patientId);
      setPatient(data);
    } catch (error) {
      console.error('Failed to fetch patient:', error);
      alert('Patient not found');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'underweight':
        return 'badge badge-underweight';
      case 'normal':
        return 'badge badge-normal';
      case 'overweight':
        return 'badge badge-overweight';
      case 'obese':
        return 'badge badge-obese';
      default:
        return 'badge';
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!patient) {
    return <div className="container">Patient not found</div>;
  }

  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1>Patient Details</h1>
          <div className="header-actions">
            <button className="btn btn-small" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="patient-detail">
          <h2>{patient.name}</h2>
          
          <div className="detail-grid">
            <div className="detail-item">
              <label>Patient ID</label>
              <div className="detail-value">{patient.id}</div>
            </div>
            <div className="detail-item">
              <label>Age</label>
              <div className="detail-value">{patient.age} years</div>
            </div>
            <div className="detail-item">
              <label>Gender</label>
              <div className="detail-value">{patient.gender}</div>
            </div>
            <div className="detail-item">
              <label>City</label>
              <div className="detail-value">{patient.city}</div>
            </div>
            <div className="detail-item">
              <label>Height</label>
              <div className="detail-value">{patient.height} meters</div>
            </div>
            <div className="detail-item">
              <label>Weight</label>
              <div className="detail-value">{patient.weight} kg</div>
            </div>
            <div className="detail-item">
              <label>BMI</label>
              <div className="detail-value">{patient.bmi}</div>
            </div>
            <div className="detail-item">
              <label>Health Verdict</label>
              <div className="detail-value">
                <div className={getBadgeClass(patient.verdict)}>{patient.verdict}</div>
              </div>
            </div>
            {patient.diagnosis && (
              <div className="detail-item detail-full">
                <label>Diagnosis</label>
                <div className="detail-value">{patient.diagnosis}</div>
              </div>
            )}
            {patient.prescription && (
              <div className="detail-item detail-full">
                <label>Prescription</label>
                <div className="detail-value">{patient.prescription}</div>
              </div>
            )}
            <div className="detail-item detail-full">
              <label>Created At</label>
              <div className="detail-value">{new Date(patient.created_at).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}