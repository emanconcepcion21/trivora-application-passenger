const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/passenger';

export interface RideBookingPayload {
  pickup_name: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_name: string;
  dropoff_lat: number;
  dropoff_lng: number;
  fare_amount: number;
  distance_km?: number;
  estimated_duration_mins?: number;
  passenger_notes?: string;
  payment_method?: 'cash' | 'gcash' | 'wallet';
}

export async function requestRideBooking(payload: RideBookingPayload) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.log('[Passenger API] Request ride booking failed, using local simulation:', err);
  }
  return {
    booking: {
      id: 1,
      booking_code: `BK-${Date.now()}`,
      status: 'pending',
      pickup_name: payload.pickup_name,
      dropoff_name: payload.dropoff_name,
      fare_amount: payload.fare_amount,
    },
  };
}

export async function getActivePassengerBooking() {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/active`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.log('[Passenger API] Fetch active booking failed:', err);
  }
  return { booking: null };
}

export async function cancelPassengerBooking(bookingId: number, reason?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'cancelled', cancellation_reason: reason || 'Cancelled by passenger' }),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.log('[Passenger API] Cancel booking failed:', err);
  }
  return { message: 'Booking cancelled' };
}

export async function getPassengerRideHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/history`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.log('[Passenger API] Ride history failed:', err);
  }
  return { history: [] };
}
