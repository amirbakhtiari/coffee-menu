
export interface LoginResponse {
  success: boolean;
  message: string;
}

export interface VerifyResponse {
  success: boolean;
  token: string;
  user: {
    fullName: string;
    mobile: string;
  };
}

/**
 * Simulates an API call to send OTP to mobile
 */
export const requestOTP = async (mobile: string): Promise<LoginResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`OTP requested for: ${mobile}`);
      resolve({
        success: true,
        message: 'کد تایید با موفقیت ارسال شد'
      });
    }, 1500);
  });
};

/**
 * Simulates an API call to verify OTP
 */
export const verifyOTP = async (mobile: string, code: string): Promise<VerifyResponse> => {
  console.log(`Verifying OTP for ${mobile} with code: ${code}`);
  return new Promise((resolve, reject) => {
    if (code === '1234') {
      console.log('OTP verified successfully!');
      resolve({
        success: true,
        token: 'mock-jwt-token',
        user: {
          fullName: 'امیر بختیاری',
          mobile: mobile
        }
      });
    } else {
      console.error('OTP verification failed: incorrect code');
      reject(new Error('کد وارد شده صحیح نیست'));
    }
  });
};
