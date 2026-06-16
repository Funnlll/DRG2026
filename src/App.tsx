import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Step1School from '@/pages/Step1School'
import Step2VisitStudents from '@/pages/Step2VisitStudents'
import Step3FieldTrip from '@/pages/Step3FieldTrip'
import Success from '@/pages/Success'
import Records from '@/pages/Records'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/step/1" replace />} />
        <Route path="/step/1" element={<Step1School />} />
        <Route path="/step/2" element={<Step2VisitStudents />} />
        <Route path="/step/3" element={<Step3FieldTrip />} />
        <Route path="/success" element={<Success />} />
        <Route path="/records" element={<Records />} />
        <Route path="*" element={<Navigate to="/step/1" replace />} />
      </Routes>
    </Router>
  )
}
