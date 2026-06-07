import { CafeStatus } from '../../types';

// Simulated server-side persistence for the override state
let serverClosedOverride: boolean | null = null;

/**
 * Calculates current status of the cafe based on server-side Iran business hours
 * (Sat-Wed 8:00-23:00, Thu 8:00-24:00, Fri 10:00-23:00) and any manual administrative overrides in the system.
 */
function calculateStatus(): CafeStatus {
  const now = new Date();
  
  // Iran time is UTC + 3.5 hours
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcDay = now.getUTCDay(); // 0: Sunday, 1: Monday, ... 6: Saturday

  let localMinutes = utcMinutes + 30;
  let localHours = utcHours + 3;
  let localDay = utcDay;

  if (localMinutes >= 60) {
    localMinutes -= 60;
    localHours += 1;
  }
  if (localHours >= 24) {
    localHours -= 24;
    localDay = (localDay + 1) % 7;
  }

  let isClosed = false;
  if (serverClosedOverride !== null) {
    isClosed = serverClosedOverride;
  } else {
    if (localDay === 5) { // Friday
      isClosed = localHours < 10 || localHours >= 23;
    } else if (localDay === 4) { // Thursday
      isClosed = localHours < 8 || localHours >= 24;
    } else { // Sat-wed etc
      isClosed = localHours < 8 || localHours >= 23;
    }
  }

  // Work out working hours label
  let workingHoursText = 'شنبه تا چهارشنبه: ۸:۰۰ الی ۲۳:۰۰';
  if (localDay === 5) {
    workingHoursText = 'جمعه‌ها: ۱۰:۰۰ الی ۲۳:۰۰';
  } else if (localDay === 4) {
    workingHoursText = 'پنجشنبه‌ها: ۸:۰۰ الی ۲۴:۰۰';
  }

  return {
    isClosed,
    workingHoursText,
    isClosedOverride: serverClosedOverride
  };
}

/**
 * REST API call simulator: GET /api/cafe/status
 */
export const getCafeStatusApi = async (): Promise<CafeStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(calculateStatus());
    }, 150); // Minor network latency simulator
  });
};

/**
 * REST API call simulator: POST /api/cafe/status/override
 */
export const updateCafeStatusOverrideApi = async (override: boolean | null): Promise<CafeStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      serverClosedOverride = override;
      resolve(calculateStatus());
    }, 150);
  });
};
