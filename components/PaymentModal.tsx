import React, { useState } from 'react';
import { X, CreditCard, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { addCredits } from '../services/creditService';
import { useUser } from '@clerk/clerk-react';

interface PaymentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  razorpayKeyId: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isVisible, onClose, onSuccess, razorpayKeyId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useUser();

  if (!isVisible) return null;

  const handleRazorpayPayment = () => {
    setIsProcessing(true);

    const options = {
      key: razorpayKeyId, // Enter the Key ID generated from the Dashboard
      amount: "10000", // Amount is in currency subunits. Default currency is INR. Hence, 10000 refers to 10000 paise (100 INR)
      currency: "INR",
      name: "MonoSpace AI",
      description: "Purchase 5 Credits",
      image: "https://cdn-icons-png.flaticon.com/512/1216/1216649.png",
      handler: function (response: any) {
        // In a real app, you would verify response.razorpay_payment_id and signature on your backend
        console.log("Payment successful", response);
        addCredits(5, user?.id);
        setIsProcessing(false);
        onSuccess();
      },
      prefill: {
        name: user?.fullName || "Guest User",
        email: user?.primaryEmailAddress?.emailAddress || "user@example.com",
        contact: "9999999999" // Optional
      },
      theme: {
        color: "#0a0a0a"
      },
      modal: {
        ondismiss: function() {
            setIsProcessing(false);
        }
      }
    };

    try {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
        
        rzp1.on('payment.failed', function (response: any){
            alert("Payment Failed: " + response.error.description);
            setIsProcessing(false);
        });
    } catch (e) {
        console.error("Razorpay SDK not loaded", e);
        setIsProcessing(false);
        alert("Payment system failed to load. Please check your connection.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-black w-full max-w-md border border-black dark:border-white rounded-lg p-6 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap size={24} fill="currentColor" />
          </div>
          <h2 className="text-xl font-sans font-bold uppercase tracking-wide text-black dark:text-white mb-2">
            Get Premium Credits
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">
            Top up your account to continue designing. Premium credits are used after your daily free limit and never expire.
          </p>
        </div>

        <div className="border border-gray-200 dark:border-zinc-800 rounded-md p-4 mb-6 bg-gray-50 dark:bg-zinc-900/50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-lg text-black dark:text-white font-sans">5 Credits</span>
            <span className="font-bold text-lg text-black dark:text-white font-sans">₹100</span>
          </div>
          <p className="text-xs text-gray-500 font-sans">1 Credit = 1 Room Redesign.</p>
        </div>

        <button
          onClick={handleRazorpayPayment}
          disabled={isProcessing}
          className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity rounded-md flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
                <CreditCard size={16} />
                Pay ₹100 via Razorpay
            </>
          )}
        </button>
        
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-sans uppercase">
          <ShieldCheck size={12} />
          <span>Secured by Razorpay</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;