/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { useRegisterForEventMutation } from '@/RTK/EventsQuery/eventsQuery'
import { useCompleteRegistrationFormMutation } from '@/RTK/RegistrationsQuery/registrationsQuery'
import type { EventFormField, EventRegistration } from '@/RTK/EventsQuery/endpoint'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  eventTitle: string
  formFields?: EventFormField[]
  onRegistered?: (registration: EventRegistration) => void
}

const sortedFields = (fields: EventFormField[]) =>
  [...fields].sort((a, b) => a.order_index - b.order_index)

const RegistrationModal = ({ isOpen, onClose, eventId, eventTitle, formFields, onRegistered }: RegistrationModalProps) => {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [registerForEvent, { isLoading: isRegistering }] = useRegisterForEventMutation()
  const [completeForm] = useCompleteRegistrationFormMutation()

  if (!isOpen) return null

  const fields = sortedFields(formFields ?? [])

  const handleClose = () => {
    setResponses({})
    setFieldErrors({})
    onClose()
  }

  const setFieldValue = (fieldId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }))
    setFieldErrors((prev) => {
      if (!prev[fieldId]) return prev
      const next = { ...prev }
      delete next[fieldId]
      return next
    })
  }

  const validate = () => {
    const errors: Record<string, string> = {}
    for (const field of fields) {
      if (field.is_required && !responses[field.id]?.trim()) {
        errors[field.id] = 'This field is required'
      }
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const payloadResponses = fields
        .filter((field) => responses[field.id]?.trim())
        .map((field) => ({ field_id: field.id, response_value: responses[field.id].trim() }))

      const result = await registerForEvent({ event_id: eventId, responses: payloadResponses }).unwrap()
      toast.success(result.message || 'Registered successfully')

      if (result.data.requires_form || result.data.is_form_incomplete) {
        try {
          await completeForm({ registration_id: result.data.id }).unwrap()
        } catch {
          // Non-fatal — the registration itself succeeded.
        }
      }

      onRegistered?.(result.data)
      handleClose()
    } catch (err: any) {
      const details = err?.data?.error?.details
      if (Array.isArray(details) && details.length > 0) {
        const errors: Record<string, string> = {}
        details.forEach((d: any) => {
          if (d.field_id) errors[d.field_id] = d.message || 'Invalid value'
        })
        setFieldErrors(errors)
        toast.error('Please fix the highlighted fields.')
      } else {
        const msg = err?.data?.message || err?.error || 'Registration failed. Please try again.'
        toast.error(msg)
      }
    }
  }

  const renderField = (field: EventFormField) => {
    const value = responses[field.id] || ''
    const error = fieldErrors[field.id]
    const labelNode = (
      <label className="block text-gray-700 font-medium mb-2">
        {field.field_label}
        {field.is_required && <span className="text-red-500"> *</span>}
      </label>
    )

    const baseInputClass =
      'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'

    let control: React.ReactNode
    switch (field.field_type) {
      case 'textarea':
        control = (
          <textarea
            value={value}
            onChange={(e) => setFieldValue(field.id, e.target.value)}
            rows={3}
            className={baseInputClass}
          />
        )
        break
      case 'select':
        control = (
          <select value={value} onChange={(e) => setFieldValue(field.id, e.target.value)} className={baseInputClass}>
            <option value="">Select an option</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
        break
      case 'radio':
      case 'checkbox':
        control = (
          <div className="flex flex-wrap gap-4">
            {field.options.map((option) => (
              <label key={option} className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => setFieldValue(field.id, e.target.value)}
                />
                {option}
              </label>
            ))}
          </div>
        )
        break
      case 'number':
        control = (
          <input
            type="number"
            value={value}
            onChange={(e) => setFieldValue(field.id, e.target.value)}
            className={baseInputClass}
          />
        )
        break
      case 'date':
        control = (
          <input
            type="date"
            value={value}
            onChange={(e) => setFieldValue(field.id, e.target.value)}
            className={baseInputClass}
          />
        )
        break
      case 'email':
        control = (
          <input
            type="email"
            value={value}
            onChange={(e) => setFieldValue(field.id, e.target.value)}
            className={baseInputClass}
          />
        )
        break
      default:
        control = (
          <input
            type="text"
            value={value}
            onChange={(e) => setFieldValue(field.id, e.target.value)}
            className={baseInputClass}
          />
        )
    }

    return (
      <div key={field.id} className="mb-6">
        {labelNode}
        {control}
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Register</h2>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <p className="text-gray-600 mb-4">Register for this event</p>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <h3 className="text-2xl font-bold text-gray-900">{eventTitle}</h3>
          </div>

          <form onSubmit={handleSubmit}>
            {fields.length > 0 ? (
              fields.map(renderField)
            ) : (
              <p className="text-gray-600 mb-6">No additional information is needed — just confirm your registration.</p>
            )}

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full bg-[#ffa500] hover:bg-orange-600 text-white font-semibold py-4 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isRegistering ? 'Registering…' : 'Confirm Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegistrationModal
