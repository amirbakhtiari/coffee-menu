
import { useMutation } from '@tanstack/react-query';
import { requestOTP, verifyOTP } from '../../services/api/auth';

export const useAuthApi = () => {
  const requestOtpMutation = useMutation({
    mutationFn: (mobile: string) => requestOTP(mobile),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ mobile, code }: { mobile: string; code: string }) => verifyOTP(mobile, code),
  });

  return {
    requestOtp: requestOtpMutation.mutate,
    isRequestingOtp: requestOtpMutation.isPending,
    requestOtpSuccess: requestOtpMutation.isSuccess,
    
    verifyOtp: verifyOtpMutation.mutate,
    isVerifyingOtp: verifyOtpMutation.isPending,
    verifyOtpSuccess: verifyOtpMutation.isSuccess,
    verifyOtpError: verifyOtpMutation.error
  };
};
