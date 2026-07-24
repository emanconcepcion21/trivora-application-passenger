import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

type Passenger = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  profile_image?: string | null;
};

type PassengerContextType = {
  passenger: Passenger | null;

  setPassenger: (
    passenger: Passenger | null
  ) => void;

  updatePassenger: (
    passengerData: Partial<Passenger>
  ) => void;

  logoutPassenger: () => void;
};

const PassengerContext =
  createContext<PassengerContextType | undefined>(
    undefined
  );

export function PassengerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [passenger, setPassenger] =
    useState<Passenger | null>(null);

  // UPDATE PASSENGER DATA
  const updatePassenger = (
    passengerData: Partial<Passenger>
  ) => {
    setPassenger((currentPassenger) => {

      // WALANG LOGGED-IN PASSENGER
      if (!currentPassenger) {
        return currentPassenger;
      }

      // UPDATE ONLY THE PROVIDED DATA
      return {
        ...currentPassenger,
        ...passengerData,
      };
    });
  };

  // LOGOUT PASSENGER
  const logoutPassenger = () => {
    setPassenger(null);
  };

  return (
    <PassengerContext.Provider
      value={{
        passenger,
        setPassenger,
        updatePassenger,
        logoutPassenger,
      }}
    >
      {children}
    </PassengerContext.Provider>
  );
}

export function usePassenger() {
  const context = useContext(
    PassengerContext
  );

  if (!context) {
    throw new Error(
      'usePassenger must be used inside PassengerProvider'
    );
  }

  return context;
}