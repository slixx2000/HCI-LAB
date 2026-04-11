import { BrowserRouter, Routes, Route } from 'react-router-dom'

import EventDetailsPage from '@/EventDetailsPage'
import HomePage from '@/HomePage'
import { AccessibilityWidget } from '@/components/ui/accessibility-widget'
import { ToastProvider } from '@/components/ui/toast'
import { EventStoreProvider } from '@/state/event-store'

export default function App() {
  return (
    <ToastProvider>
      <EventStoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
          </Routes>
          <AccessibilityWidget />
        </BrowserRouter>
      </EventStoreProvider>
    </ToastProvider>
  )
}
